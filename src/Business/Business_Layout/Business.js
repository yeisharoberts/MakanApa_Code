import { useEffect, useState } from "react";
import '../Business_CSS/Business.css';
import AppFooter from '../../AppFooter';
import Axios from 'axios';
import Slider from "react-slick";
import avatarImg from '../../img/avatar.png';
import BusinessReportReviewsModal from "./BusinessReportReviewsModal";
import BusinessSettings from "./BusinessSettings";

// Bootstrap Imports
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';
import NavDropdown from 'react-bootstrap/NavDropdown';

// Material UI Imports
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';

// React Charts Imports
import { CChart } from '@coreui/react-chartjs';

// Icons Imports
import { BsFillPeopleFill, BsFillTrophyFill } from "react-icons/bs";
import { RiEmotionHappyLine } from "react-icons/ri";
import { FaRegAngry, FaInstagramSquare, FaTiktok } from "react-icons/fa";
import { MdSentimentNeutral } from "react-icons/md";
import { AiFillFacebook, AiFillTwitterSquare } from "react-icons/ai";
import { BiLike, BiDislike } from "react-icons/bi";
import { MdOutlineReport } from "react-icons/md";

function Business() {

    const [graphReviews, setGraphReviews] = useState([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
    const [businessData, setBusinessData] = useState([]);
    const [businessId, setBusinessId] = useState(0);
    const [resReviews, setResReviews] = useState([]);
    const [resList, setResList] = useState([]);
    const [businessName, setBusinessName] = useState('');
    const [resRank, setResRank] = useState(0);
    const [countReviewHappy, setCountReviewHappy] = useState([]);
    const [countReviewNeutral, setCountReviewNeutral] = useState([]);
    const [countReviewSad, setCountReviewSad] = useState([]);
    const [usersReview, setUsersReview] = useState([]);
    const [usersInitReview, setUsersInitReview] = useState([]);
    const [filter, setFilter] = useState(1);
    const moment = require('moment');
    const [reviewToDelete, setReviewToDelete] = useState(0);
    const [graphCustomers, setGraphCustomers] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const [showModal, setShowModal] = useState(false);
    function handleShowModalState(childShowModal) {
        setShowModal(childShowModal);
    }

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(10);
    const [countRevs, setCountRevs] = useState(0);
    const pageNumbers = [];
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    for (let i = 1; i <= Math.ceil(countRevs / reviewsPerPage); i++) {
        pageNumbers.push(i);
    }

    const [reviewAlerts, setReviewAlerts] = useState(Array(usersReview.length).fill(false));

    const handleBadgeClick = (index) => {
        const newReviewAlerts = [...reviewAlerts];
        newReviewAlerts[index] = !newReviewAlerts[index];
        setReviewAlerts(newReviewAlerts);
    };

    // below is for the restaurant list displayed in a vertical carousel
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        beforeChange: function (currentSlide, nextSlide) {
            console.log("before change", currentSlide, nextSlide);
        },
        afterChange: function (currentSlide) {
            console.log("after change", currentSlide);
        }
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login_business").then((res) => {
            let temp_businessLoggedIn = res.data.business_loggedIn;
            if (temp_businessLoggedIn === true) {
                let temp_businessId = res.data.business[0].id;
                let temp_businessName = res.data.business[0].rest_name;
                setBusinessId(temp_businessId);
                setBusinessName(temp_businessName);
            }
        });

        Axios.post('http://localhost:3001/get_business_data', {
            businessId: businessId
        }).then((res) => {
            setBusinessData(res.data);
        });

        Axios.post("http://localhost:3001/get_review_details", {
            adminId: businessId
        }).then((res) => {
            setResReviews(res.data);
            // Below are the code to be displayed on the bar chart
            const review_happy = res.data.filter(function (value) {
                return value.review_sentiment > 0;
            });
            const review_neutral = res.data.filter(function (value) {
                return value.review_sentiment === 0;
            });
            const review_sad = res.data.filter(function (value) {
                return value.review_sentiment < 0;
            });
            setCountReviewHappy(review_happy);
            setCountReviewNeutral(review_neutral);
            setCountReviewSad(review_sad);
        });


        Axios.get('http://localhost:3001/business_ret_list').then((res) => {
            setResList(res.data);
            const findIndex = resList.map(object => object.id).indexOf(businessId);
            if (findIndex >= 0) {
                const result = findIndex;
                setResRank(result + 1);
            } else {
                setResRank(0);
            }
        });

        countReviews();
        countCustomers();
    });

    useEffect(() => {
        Axios.post("http://localhost:3001/business_get_user_reviews", {
            adminId: businessId
        }).then((res) => {
            setUsersInitReview(res.data);
            // Below is the code to filter user reviews based on its sentiment analysis value (positive, neutral, negative)
            let filteredResReviews = usersInitReview.filter((res_val) => {
                if (res_val.review_sentiment > 0 && filter === 2) {
                    return true;
                } else if (res_val.review_sentiment === 0 && filter === 3) {
                    return true;
                } else if (res_val.review_sentiment < 0 && filter === 4) {
                    return true;
                } else if (filter === 1) {
                    return true
                }
                else {
                    return false
                }
            });

            const indexOfLastReview = currentPage * reviewsPerPage;
            const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
            const setGetReview = filteredResReviews.slice(indexOfFirstReview, indexOfLastReview);
            setUsersReview(setGetReview);
            setCountRevs(filteredResReviews.length);
        });
    });

    function countReviews() {
        let i = 0;
        let countHappy = 0;
        let countNeutral = 0;
        let countSad = 0;
        const arr_months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const updatedGraphReviews = [...graphReviews];

        while (i < arr_months.length) {
            for (let k = 0; k < resReviews.length; k++) {
                if (moment(resReviews[k].review_timestamp).format("MM") === arr_months[i] && resReviews[k].review_sentiment > 0) {
                    countHappy++;
                } else if (moment(resReviews[k].review_timestamp).format("MM") === arr_months[i] && resReviews[k].review_sentiment === 0) {
                    countNeutral++;
                } else if (moment(resReviews[k].review_timestamp).format("MM") === arr_months[i] && resReviews[k].review_sentiment < 0) {
                    countSad++;
                }
            }
            updatedGraphReviews[0][i] = countHappy;
            updatedGraphReviews[1][i] = countNeutral;
            updatedGraphReviews[2][i] = countSad;
            countHappy = 0;
            countNeutral = 0;
            countSad = 0;
            i++;
        }
        setGraphReviews(updatedGraphReviews);
    }

    function countCustomers() {
        const arr_months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        let i = 0;
        let count = 0;
        const updatedGraphCustomers = [...graphCustomers];

        while (i < arr_months.length) {
            for (let k = 0; k < resReviews.length; k++) {
                if (moment(resReviews[k].review_timestamp).format("MM") === arr_months[i]) {
                    count++;
                }
            }
            updatedGraphCustomers[i] = count;
            count = 0;
            i++;
        }

        for (let a = 0; a < updatedGraphCustomers.length; a++) {
            if (updatedGraphCustomers[a] === 0) {
                updatedGraphCustomers[a] = null;
            }
        }
        setGraphCustomers(updatedGraphCustomers);
    }

    return (
        <>
            <BusinessReportReviewsModal handleShowModalState={handleShowModalState} showModal={showModal} reviewToDelete={reviewToDelete} businessId={businessId} />
            <div className="parent-admin">
                <div className='parent-tab'>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col sm={2}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link className='nav-link-edit' eventKey="first">DASHBOARD</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='nav-link-edit' eventKey="second">REVIEWS</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='nav-link-edit' eventKey="third">SETTINGS</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={10} className='tab-col-body'>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <div>
                                            <Row>
                                                <Col>
                                                    <Card className='heading-card'>
                                                        <Card.Body>
                                                            <div className='heading-container'>
                                                                <p className='heading-title'>TOTAL REVIEWS RECEIVED</p>
                                                                <div className="heading-total-reviews">
                                                                    <div className='people-icon-container'>
                                                                        <BsFillPeopleFill className='people-icon' />
                                                                    </div>
                                                                    <p className='people-count'>{resReviews.length}</p>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Card className='heading-card'>
                                                        <Card.Body>
                                                            <div className='heading-container'>
                                                                <p className='heading-title'>RESTAURANT RANK</p>
                                                                <div className="heading-total-reviews">
                                                                    <div className='trophy-icon-container'>
                                                                        <BsFillTrophyFill className='people-icon' />
                                                                    </div>
                                                                    <p className='people-count'>{resRank}</p>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Card className='heading-card'>
                                                        <Card.Body>
                                                            <div>
                                                                <div className='heading-container'>
                                                                    <p className='heading-title'>REVIEW SUMMARY</p>
                                                                    <div className='icons-group'>
                                                                        <div className='heading-icon-1'>
                                                                            <div className='review-happy-container'>
                                                                                <RiEmotionHappyLine className='happy-icon' />
                                                                            </div>
                                                                            <p className='review-summary-count'>{countReviewHappy.length}</p>
                                                                        </div>
                                                                        <div className='heading-icon-1 ml-3'>
                                                                            <div className='review-neutral-container'>
                                                                                <MdSentimentNeutral className='happy-icon' />
                                                                            </div>
                                                                            <p className='review-summary-count'>{countReviewNeutral.length}</p>
                                                                        </div>
                                                                        <div className='heading-icon-1 ml-3'>
                                                                            <div className='review-sad-container'>
                                                                                <FaRegAngry className='sad-icon' />
                                                                            </div>
                                                                            <p className='review-summary-count'>{countReviewSad.length}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Card className='mb-3 mt-5'>
                                                <Card.Body>
                                                    <div className='display-chart'>
                                                        <Row>
                                                            <Col>
                                                                <div className="total-review-title">
                                                                    REVIEWS SUMMARY
                                                                </div>
                                                                <CChart
                                                                    type="bar"
                                                                    data={{
                                                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                                                        datasets: [
                                                                            {
                                                                                label: 'Positive Reviews',
                                                                                backgroundColor: 'green',
                                                                                data: graphReviews[0]
                                                                            },
                                                                            {
                                                                                label: 'Neutral Reviews',
                                                                                backgroundColor: 'gray',
                                                                                data: graphReviews[1],
                                                                            },
                                                                            {
                                                                                label: 'Negative Reviews',
                                                                                backgroundColor: 'red',
                                                                                data: graphReviews[2],
                                                                            },
                                                                        ],
                                                                    }}
                                                                    labels="months"
                                                                />

                                                            </Col>
                                                            <Col>
                                                                <div className="total-review-title">
                                                                    TOTAL REVIEWS RECEIVED
                                                                </div>
                                                                <CChart
                                                                    type="line"
                                                                    data={{
                                                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                                                        datasets: [
                                                                            {
                                                                                label: "My First dataset",
                                                                                backgroundColor: "#880808",
                                                                                borderColor: "#880808",
                                                                                pointBackgroundColor: "#880808",
                                                                                pointBorderColor: "#880808",
                                                                                data: graphCustomers.concat([100])
                                                                            }
                                                                        ],
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            <Row>
                                                <Col>
                                                    <Card className='p-static' style={{ minHeight: '600px' }}>
                                                        <div className="rank-list-title">
                                                            TOP 10 RANK LIST
                                                        </div>
                                                        <div className='slider-component'>
                                                            <Slider {...settings}>
                                                                {resList.map((element, index) => {
                                                                    return (
                                                                        <>
                                                                            <div style={{ padding: '15px' }}>
                                                                                <h3 key={element.id}>{index + 1}. {element.rest_name}</h3>
                                                                                < p style={{ textAlign: 'justify' }}>{element.rest_desc}</p>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })}
                                                            </Slider>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Card className='mb-5 p-static'>
                                                        <div className="manage-socials-title">
                                                            MANAGE SOCIALS
                                                        </div>
                                                        <div className="admin-display-socials-container">
                                                            <AiFillFacebook className="display-fb-socials" onClick={() => { window.location.replace('https://facebook.com'); }} />
                                                            <div>
                                                                <FaInstagramSquare className="display-ig-socials" onClick={() => { window.location.replace('https://instagram.com'); }} />
                                                            </div>
                                                            <div>
                                                                <AiFillTwitterSquare className="display-twitter-socials" onClick={() => { window.location.replace('https://twitter.com'); }} />
                                                            </div>
                                                            <div className="tt-social-container">
                                                                <FaTiktok className="display-tt-socials" onClick={() => { window.location.replace('https://tiktok.com'); }} />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <div className='parent-sec-tab-pane'>
                                            <div className='parent-admin-title-container'>
                                                <div className='admin-review-title'>
                                                    <div style={{ fontSize: '25px', fontWeight: '900' }}>
                                                        Reviews ({usersReview.length})
                                                    </div>
                                                </div>

                                                <div className='admin-review-desc d-flex justify-content-between'>
                                                    <div>
                                                        Total Reviews Received: {usersInitReview.length}
                                                    </div>
                                                    <div className='pill-review-filter'>
                                                        <div className='child-review-filter'>
                                                            <p>Sort Review By:</p>
                                                            <Nav>
                                                                <NavDropdown
                                                                    id="nav-dropdown-dark-example"
                                                                    title=""
                                                                    menuVariant="dark"
                                                                >
                                                                    <NavDropdown.Item href="#!" onClick={(e) => { setFilter(1); setReviewAlerts(Array(usersReview.length).fill(false)); }}>All</NavDropdown.Item>
                                                                    <NavDropdown.Divider />
                                                                    <NavDropdown.Item href="#!" onClick={(e) => { setFilter(2); setReviewAlerts(Array(usersReview.length).fill(false)); }}>
                                                                        Positive
                                                                    </NavDropdown.Item>
                                                                    <NavDropdown.Item href="#!" onClick={(e) => { setFilter(3); setReviewAlerts(Array(usersReview.length).fill(false)); }}>Neutral</NavDropdown.Item>
                                                                    <NavDropdown.Item href="#!" onClick={() => { setFilter(4); setReviewAlerts(Array(usersReview.length).fill(false)); }}>
                                                                        Negative
                                                                    </NavDropdown.Item>
                                                                </NavDropdown>
                                                            </Nav>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {usersReview.map((val, index) => {
                                                return (
                                                    <div key={index} className='parent-admin-reviews-container'>
                                                        <Paper elevation={2} className='mt-3'>
                                                            <Row>
                                                                <Col xs={4}>
                                                                    <div className='parent-review-col1'>
                                                                        <div className="user-image">
                                                                            <img src={avatarImg} alt="" width="50" height="50" style={{ borderRadius: '50%' }} />
                                                                        </div>
                                                                        <div style={{ marginLeft: '13px' }}>
                                                                            <div style={{ fontWeight: '500' }}>
                                                                                {val.first_name} {val.last_name}
                                                                            </div>
                                                                            <div style={{ fontSize: '13px', fontWeight: '300' }}>
                                                                                @{val.username}
                                                                            </div>
                                                                            <div style={{ color: 'gray', fontSize: '13px' }}>
                                                                                Posted on: {moment(val.review_timestamp).format("DD/MM/YYYY")}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                                <Col>
                                                                    <div className='parent-review-col2'>
                                                                        <div className='review-more-btn'>
                                                                            <Button variant='light' style={{ marginRight: '10px', marginTop: '10px' }} onClick={(e) => {
                                                                                setReviewToDelete(val.review_id);
                                                                                setShowModal(!showModal);
                                                                            }}><MdOutlineReport style={{ fontSize: '20px' }} /></Button>
                                                                        </div>
                                                                        <div className='prcol2-row1'>
                                                                            {val.review_like > 0 ? <Badge bg="success" pill style={{ marginRight: '10px' }}>
                                                                                <BiLike />
                                                                            </Badge> : <Badge bg="danger" pill style={{ marginRight: '10px' }}>
                                                                                <BiDislike />
                                                                            </Badge>}

                                                                            {val.review_text}
                                                                        </div>

                                                                        {val.review_sentiment < 0 && (
                                                                            <>
                                                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                                    <div className='parent-badge-improvements'>
                                                                                        <Chip label="Poor Service" color="error" />
                                                                                    </div>
                                                                                    <div className='parent-badge-improvements hover-pointer'>
                                                                                        <Chip label="Needs Improvements" color="error" onClick={() => handleBadgeClick(index)} />
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {val.review_sentiment > 0 && (
                                                                            <div className='parent-badge-improvements'>
                                                                                <Chip label="Excellent Service" color="success" />
                                                                            </div>
                                                                        )}

                                                                        {val.review_sentiment === 0 && (
                                                                            <>
                                                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                                    <div className='parent-badge-improvements'>
                                                                                        <Chip label="Average Service" color="warning" />
                                                                                    </div>
                                                                                    <div className='parent-badge-improvements hover-pointer'>
                                                                                        <Chip label="Needs Improvements" color="error" onClick={() => handleBadgeClick(index)} />
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {reviewAlerts[index] && <div style={{ marginTop: '20px', marginRight: '20px' }}>
                                                                            <Alert severity="error">{val.feedback}</Alert>
                                                                            <p></p>
                                                                        </div>}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Paper>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <nav>
                                            <ul className="pagination">
                                                {pageNumbers.map(number => (
                                                    <li key={number} className="page-item">
                                                        <a href="#!" onClick={() => paginate(number)} className="page-link">
                                                            {number}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="third">
                                        <BusinessSettings businessData={businessData} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </div>
            <AppFooter />
        </>
    );
}

export default Business;