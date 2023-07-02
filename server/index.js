const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowing the cookie to be enabled
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        key: "userId",
        secret: "justinbieber",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 1000 * 24
        }
    })
);

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'foodrec'
});

app.listen(3001, () => {
    console.log("server is now running on port 3001")
});

// ROUTES
// POST
app.post('/register_action', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const image = req.body.image;

    db.query("INSERT INTO users (first_name, last_name, email, username, password, profile_image) VALUES (?,?,?,?,?,?)", [firstName, lastName, email, username, password, image], (err) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    });
});

app.post('/login_action', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE username = ?  AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                req.session.user = result;
                console.log(req.session.user);
                res.send(result);
            } else {
                res.send({ status: 401, message: "Incorrect Credentials!" });
            }
        });
});

app.post('/logout_action', (req, res) => {
    res.clearCookie("userId", { path: "/" });
    res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
});

app.post('/ret_info', (req, res) => {
    const rest_id = req.body.rest_id;

    db.query("SELECT * FROM foodrec.restaurant WHERE restaurant.id = ?", rest_id,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.send(result);
            }
        });
});

app.post('/ret_reviews', (req, res) => {
    const rest_id = req.body.rest_id;

    db.query("SELECT *, reviews.id AS review_id FROM foodrec.reviews INNER JOIN foodrec.users ON reviews.user_id = users.id WHERE reviews.rest_id = ?", rest_id,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.send(result);
            }
        });
});

app.post('/post_review', (req, res) => {
    const comment = req.body.comment;
    const ratingLike = req.body.like;
    const ratingDislike = req.body.dislike;
    const rest_id = req.body.rest_id;
    const user_id = req.body.user_id;
    const sentiment_score = req.body.sentimentScore;
    const timestamp = req.body.timestamp;
    db.query("INSERT INTO reviews (rest_id, user_id, review_text, review_dislike, review_like, review_sentiment, review_timestamp) VALUES (?,?,?,?,?,?,?)", [rest_id, user_id, comment, ratingDislike, ratingLike, sentiment_score, timestamp], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send({ status: 200, comment: comment, sentiment_score })
        }
    });
});

app.post('/post_feedback', (req, res) => {
    const review_id = req.body.review_id;
    const feedback = req.body.feedback;

    db.query("INSERT INTO improvements (review_id, feedback) VALUES (?,?)", [review_id, feedback], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ status: 200 });
        }
    });
});

app.post('/ret_list', (req, res) => {
    const inputSearch = req.body.inputSearch;

    db.query("SELECT restaurant.id, rest_name, rest_desc, rest_address, SUM(reviews.review_like) AS cnt_like, SUM(reviews.review_dislike) AS cnt_dislike FROM foodrec.restaurant LEFT JOIN foodrec.reviews ON restaurant.id = reviews.rest_id WHERE (restaurant.rest_address LIKE '%" + inputSearch + "%' OR rest_name LIKE '%" + inputSearch + "%') AND restaurant.approval = 0 GROUP BY restaurant.id UNION SELECT restaurant.id, rest_name, rest_desc, rest_address, SUM(reviews.review_like) AS cnt_like, SUM(reviews.review_dislike) AS cnt_dislike FROM foodrec.restaurant RIGHT JOIN foodrec.reviews ON restaurant.id = reviews.rest_id WHERE (restaurant.rest_address LIKE '%" + inputSearch + "%' OR rest_name LIKE '%" + inputSearch + "%') AND restaurant.approval = 0 GROUP BY restaurant.id ORDER BY cnt_like DESC LIMIT 10", inputSearch, (err, result) => {
        if (err) {
            res.send({ err: err });
        } else {
            res.send(result);
        }
    });
});

app.post('/ret_user_reviews', (req, res) => {
    const userId = req.body.userId;

    db.query("SELECT *, reviews.id AS review_id FROM foodrec.reviews INNER JOIN foodrec.users ON reviews.user_id = users.id INNER JOIN foodrec.restaurant ON reviews.rest_id = restaurant.id WHERE users.id = ?", userId,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.send(result);
            }
        });
});
// BUSINESS OWNERS
app.post('/register_business', (req, res) => {
    const rest_name = req.body.rest_name;
    const business_SSM = req.body.business_SSM;
    const business_password = req.body.business_password;
    const rest_address = req.body.rest_address;
    const rest_desc = req.body.rest_desc;
    const rest_phone = req.body.rest_phone;
    const owner_phone = req.body.owner_phone;
    const website = req.body.website;
    const opening_time = req.body.opening_time;
    const closing_time = req.body.closing_time;

    db.query("INSERT INTO foodrec.restaurant (rest_name, rest_desc, rest_address, rest_phone, opening_time, closing_time, website, business_SSM, business_password, owner_phone, approval) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [rest_name, rest_desc, rest_address, rest_phone, opening_time, closing_time, website, business_SSM, business_password, owner_phone, 1], (err) => {
        if (err) {
            console.log(err)
        } else {
            res.send({ code: 200, message: "Values Inserted" });
        }
    });
});

app.post('/login_business', (req, res) => {
    const businessSSM = req.body.businessSSM;
    const password = req.body.password;

    db.query("SELECT * FROM foodrec.restaurant WHERE restaurant.business_SSM = ? AND restaurant.business_password = ?",
        [businessSSM, password],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                req.session.business = result;
                console.log(req.session.business);
                res.send(result);
            } else {
                res.send({ status: 401, message: "Incorrect Credentials!" });
            }
        });
});

app.post('/get_review_details', (req, res) => {
    const adminId = req.body.adminId;

    db.query('select * from restaurant inner join reviews on restaurant.id = reviews.rest_id where reviews.rest_id = ?', adminId, (err, result) => {
        if (err) {
            res.send({ err: err });
        } else {
            res.send(result);
        }
    });
});

app.post('/business_get_user_reviews', (req, res) => {

    const adminId = req.body.adminId;

    db.query("SELECT *, reviews.id AS review_id FROM foodrec.reviews INNER JOIN foodrec.users ON reviews.user_id = users.id LEFT OUTER JOIN foodrec.improvements ON reviews.id = improvements.review_id WHERE reviews.rest_id = ?", adminId, (err, result) => {
        if (err) {
            res.send({ err: err });
        } else {
            res.send(result);
        }
    });
});

app.post('/business_submit_review_report', (req, res) => {

    const review_desc = req.body.review_desc;
    const review_id = req.body.reviewToDelete;
    const businessId = req.body.businessId;

    db.query('INSERT INTO foodrec.reviews_report (review_id, report_desc, rest_id) VALUES (?,?,?)', [review_id, review_desc, businessId], (err) => {
        if (err) {
            res.send({ err: err });
        } else {
            res.send({ code: 200, message: "Values Inserted" });
        }
    });
});

app.post('/get_business_data', (req, res) => {

    const businessId = req.body.businessId;

    db.query('select *, id as business_id from foodrec.restaurant where id = ?', businessId, (err, result) => {
        if (err) {
            res.send({ err: err });
        } else {
            res.send(result);
        }
    });
});

// ----------------------------------------------------------------------------------
// PUT
app.put('/update_user_details', (req, res) => {
    const userId = req.body.userId;
    const userPassword = req.body.userPassword;
    const sqlUpdate = "UPDATE foodrec.users SET password = ? WHERE id = ?";

    db.query(sqlUpdate, [userPassword, userId], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error updating user details");
        } else {
            res.send({ status: 200 })
        }
    });
});

app.put('/update_business_information', (req, res) => {
    const businessId = req.body.businessId;
    const inputBusinessAutoGen = req.body.inputBusinessAutoGen;
    const inputBusinessAddress = req.body.inputBusinessAddress;
    const inputBusinessContactNo = req.body.inputBusinessContactNo;
    const inputBusinessOwnerNo = req.body.inputBusinessOwnerNo;
    const inputBusinessDesc = req.body.inputBusinessDesc;
    const inputBusinessWebLink = req.body.inputBusinessWebLink;
    const inputBusinessOpening = req.body.inputBusinessOpening;
    const inputBusinessClosing = req.body.inputBusinessClosing;
    const inputBusinessNewPwd = req.body.inputBusinessNewPwd;
    const inputBusinessSecretKey = req.body.inputBusinessSecretKey;

    db.query('UPDATE foodrec.restaurant SET rest_desc = ?, rest_address = ?, rest_phone = ?, opening_time = ?, closing_time = ?, website = ?, secret_key = ?, business_password = ?, owner_phone = ?, auto_gen_key = ? WHERE id = ?', [inputBusinessDesc, inputBusinessAddress, inputBusinessContactNo, inputBusinessOpening, inputBusinessClosing, inputBusinessWebLink, inputBusinessSecretKey, inputBusinessNewPwd, inputBusinessOwnerNo, inputBusinessAutoGen, businessId], (err, result) => {
        if (err) {
            console.log(err);
            res.send({msg: 'error'});
        } else{
            res.send({msg: 'success'})
        }
    });
});

// GET
app.get('/login_action', (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user, userType: 'user' });
    } else {
        res.send({ loggedIn: false });
    }
});

app.get('/login_business', (req, res) => {
    if (req.session.business) {
        res.send({ business_loggedIn: true, business: req.session.business, userType: 'business' });
    } else {
        res.send({ business_loggedIn: false });
    }
});

app.get('/business_ret_list', (req, res) => {
    db.query("SELECT restaurant.id, rest_name, rest_desc, rest_address, SUM(reviews.review_like) AS cnt_like, SUM(reviews.review_dislike) AS cnt_dislike FROM foodrec.restaurant LEFT JOIN foodrec.reviews ON restaurant.id = reviews.rest_id WHERE restaurant.approval = 0 GROUP BY restaurant.id UNION SELECT restaurant.id, rest_name, rest_desc, rest_address, SUM(reviews.review_like) AS cnt_like, SUM(reviews.review_dislike) AS cnt_dislike FROM foodrec.restaurant RIGHT JOIN foodrec.reviews ON restaurant.id = reviews.rest_id WHERE restaurant.approval = 0 GROUP BY restaurant.id ORDER BY cnt_like DESC", (err, result) => {
        if (err) {
            res.send({ err: err });
        } else {
            res.send(result);
        }
    });
});

// DELETE
app.delete('/delete_reviews/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM foodrec.improvements WHERE review_id = " + id + ";",
        (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    db.query("DELETE FROM foodrec.reviews WHERE id = " + id + ";",
        (err, result) => {
            if (err) {
                console.log(err);
            }
        });
});

app.delete('/delete_user/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query("DELETE FROM foodrec.users WHERE id = " + userId + ";",
        (err, result) => {
            if (err) {
                console.log(err);
            }else{
                res.send(result);
            }
        });
});

//-------------------------------------------------------
// ADMIN APIs

// POST Method
app.post('/login_admin', (req, res) => {
    const inputPassword = req.body.inputPassword;
    const admin_password = 'admin123';

    if(inputPassword === admin_password){
        req.session.admin = [{admin: 'admin'}];
        res.send({status: 200, admin: req.session.admin});
    }else {
        res.send({status: 'error', msg: 'Invalid Credentials'});
    }
});
// GET Method
app.get('/login_admin', (req, res) => {
    if (req.session.admin) {
        res.send({ loggedIn: true, admin: req.session.admin, userType: 'admin' });
    } else {
        res.send({ loggedIn: false });
    }
});
app.get('/getBusinesList', (req, res) => {

    db.query('SELECT *, id AS rest_id from foodrec.restaurant', (err, result) => {
        if(err){
            res.send({err: err});
        }else {
            res.send(result);
        }
    });
});
app.get('/getReviewReports', (req, res) => {
    db.query('SELECT *, reviews_report.id as report_id FROM foodrec.reviews_report INNER JOIN reviews ON reviews_report.review_id = reviews.id INNER JOIN restaurant ON reviews_report.rest_id = restaurant.id INNER JOIN users ON reviews.user_id = users.id', (err, result) => {
        if(err){
            res.send({err: err});
        }else{
            res.send(result);
        }
    });
});
app.get('/admin_getRegisteredUser', (req, res) => {
    db.query('SELECT * FROM foodrec.users', (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

app.get('/admin_getApprovedBusiness', (req, res) => {
    db.query('SELECT * FROM foodrec.restaurant WHERE approval = 0', (err, result) => {
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    });
});
// PUT Method
app.put('/updateBusinessApproval', (req, res) => {
    const businessId = req.body.businessId;
    const approval = req.body.approval;

    db.query('UPDATE foodrec.restaurant SET approval = ? WHERE id = ?', [approval, businessId], (err, result) => {
        if(err) {
            res.send({err: err});
        }else{
            res.send(result);
        }
    });
});
// DELETE Method
app.delete('/deleteBusinessReg/:id', (req, res) => {
    const businessId = req.params.id;

    db.query("DELETE FROM foodrec.restaurant WHERE id = " + businessId + ";",
    (err, result) => {
        if (err) {
            console.log(err);
            res.send({err: err});
        }else{
            res.send(result)
        }
    });
});
app.delete('/ignoreReport/:id', (req, res) => {
    db.query('DELETE FROM foodrec.reviews_report WHERE id = ?', req.params.id, (err, result) => {
        if(err) {
            res.send({err: err});
        }else {
            res.send(result);
        }
    });
});
app.post('/deleteReport', (req, res) => {
    const reviewId = req.body.reviewId;

    db.query('DELETE FROM foodrec.reviews WHERE id = ?', reviewId, (err, result) => {
        if(err) {
            res.send({err: err});
        }else{
            res.send(result);
        }
    });
});



