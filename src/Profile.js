// Imports: React Components
import './css/Profile.css';
import AppFooter from './AppFooter';
import avatarImg from './img/avatar.png';
import moment from 'moment';
// Imports: React Functions
import { MDBFile } from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
// Imports: Bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from '@mui/material/Alert';
import { BiLike, BiDislike } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";

import Navigation from './Navigation';

function Profile() {
    const [image, setImage] = useState(avatarImg);
    const [userDetails, setUserDetails] = useState([]);
    const [userId, setUserId] = useState(0);
    // User Details
    const [inputPassword, setInputPassword] = useState('');
    // My Reviews
    const [initReviews, setInitReviews] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewId, setReviewId] = useState(0);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(3);
    const pageNumbers = [];
    const [countRevs, setCountRevs] = useState(0);
    // Modal Delete Review Confirmation
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Modal Success Delete Review
    const [show3, setShow3] = useState(false);
    const closeShow3 = () => setShow3(false);
    // Modal Confirm Delete User
    const [showDelModal, setShowDelModal] = useState(false);

    const handleCloseDelModal = () => setShowDelModal(false);
    const handleShowDelModal = () => setShowDelModal(true);
    const navigate = useNavigate();

    for (let i = 1; i <= Math.ceil(countRevs / reviewsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handleChange = (e) => {
        setImage(e.target.value);
    };

    const updateUserDetails = () => {
        if (inputPassword.length > 1) {
            Axios.put("http://localhost:3001/update_user_details", {
                userId: userDetails[0].id,
                userPassword: inputPassword
            }).then((res) => {
                if (res.data.status === 200) {
                    setInputPassword('');
                    setShow3(true);
                }
            });
        }
    };

    const deleteReview = (id) => {
        Axios.delete(`http://localhost:3001/delete_reviews/${id}`);
    };

    const deleteUser = () => {
        Axios.delete(`http://localhost:3001/delete_user/${userId}`).then((res) => {
            if(res.status === 200){
                Axios.post('http://localhost:3001/logout_action', {}).then((result) => {
                    if (result.data.success) {
                        navigate('/Login');
                        navigate(0);
                    }
                  });
            }
        });
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/login_action").then((res) => {
            setUserDetails(res.data.user);
            setUserId(res.data.user[0].id);
        });

        Axios.post('http://localhost:3001/ret_user_reviews', {
            userId: userId
        }).then((res) => {
            setInitReviews(res.data);
            const indexOfLastReview = currentPage * reviewsPerPage;
            const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
            const setGetReview = initReviews.slice(indexOfFirstReview, indexOfLastReview);
            setUserReviews(setGetReview);
            setCountRevs(Object.keys(res.data).length);
        });
    }, [userDetails, initReviews, userReviews, countRevs, currentPage, reviewsPerPage, userId]);

    return (
        <>
            <div className="parent-profile">
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={9}>
                            <Card className="profile-card">
                                <Card.Body>
                                    <Tabs
                                        defaultActiveKey="my-profile"
                                        className="mb-3"
                                    >
                                        <Tab eventKey="my-profile" title="My Profile">
                                            <div>
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                            <img className="profile-image" src={image} alt="" width="50" height="50" />
                                                            <div className="mt-5">
                                                                <MDBFile label='Update Image' id='customFile' onChange={handleChange} />
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            {userDetails.map((val) => {
                                                                return (
                                                                    <div className="profile-details">
                                                                        <Form>
                                                                            <Form.Group className="mb-3">
                                                                                <Form.Label>First Name</Form.Label>
                                                                                <Form.Control value={val.first_name} disabled />
                                                                            </Form.Group>
                                                                            <Form.Group className="mb-3">
                                                                                <Form.Label>Last Name</Form.Label>
                                                                                <Form.Control value={val.last_name} disabled />
                                                                            </Form.Group>
                                                                            <Form.Group className="mb-3">
                                                                                <Form.Label>Username</Form.Label>
                                                                                <Form.Control disabled value={val.username} />
                                                                            </Form.Group>
                                                                            <Form.Group className="mb-3">
                                                                                <Form.Label>Password</Form.Label>
                                                                                <Form.Control type="password" placeholder="Enter New Password" value={inputPassword} onChange={(e) => { setInputPassword(e.target.value); }} />
                                                                            </Form.Group><br />

                                                                            <Modal show={show3} onHide={closeShow3}>
                                                                                <Modal.Body>Your password has updated!</Modal.Body>
                                                                                <Modal.Footer>
                                                                                    <Button variant="success" onClick={closeShow3}>
                                                                                        OK
                                                                                    </Button>
                                                                                </Modal.Footer>
                                                                            </Modal>

                                                                            <Button variant="dark" className="float-end" onClick={updateUserDetails}>
                                                                                Update
                                                                            </Button>
                                                                            <Button variant="danger" className="float-end" style={{ marginRight: "10px" }} onClick={handleShowDelModal}>
                                                                                Delete Account
                                                                            </Button>
                                                                        </Form>
                                                                    </div>
                                                                );
                                                            })}
                                                        </Col>
                                                    </Row>
                                                </Container>
                                                <Modal show={showDelModal} onHide={handleCloseDelModal}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Confirm Action</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <Alert severity='warning'>Are you sure you want to delete this account? This action is irreversable.</Alert>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleCloseDelModal}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="danger" onClick={deleteUser}>
                                                            Confirm Delete
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                        </Tab>

                                        <Tab eventKey="my-posts" title="My Posts">
                                            {userReviews.map((val) => {
                                                return (
                                                    <Card className="mt-3">
                                                        <Card.Body>
                                                            <div className="review-title">
                                                                <div className="rest-name">
                                                                    {val.rest_name}
                                                                </div>
                                                                <div className="icon-delete" style={{ fontSize: "23px" }} onClick={(e) => { handleShow(e); setReviewId(val.review_id); }}><AiTwotoneDelete /></div>
                                                            </div>
                                                            <div className="post-content">
                                                                <div className="trending-vote-img" style={{ display: 'flex' }}>

                                                                    <div className="user-image">
                                                                        <img src={avatarImg} alt="" width="50" height="50" style={{ borderRadius: '50%' }} />
                                                                    </div>&nbsp;&nbsp;&nbsp;

                                                                    <div className="user-username">@{val.username}<br /><div className="posted-date">Posted on: {moment(val.review_timestamp).format("DD/MM/YYYY")}</div></div>


                                                                </div><br />
                                                                <p>
                                                                    {
                                                                        val.review_like > 0 ?
                                                                            <Badge bg="success" pill>
                                                                                <BiLike /> {val.review_like}
                                                                            </Badge> :
                                                                            <Badge bg="danger" pill>
                                                                                <BiDislike /> {val.review_dislike}
                                                                            </Badge>
                                                                    }
                                                                    &nbsp;&nbsp;{val.review_text}
                                                                </p>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Delete Confirmation</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="danger" onClick={(e) => { deleteReview(reviewId); handleClose(); }}>
                                                        Confirm Delete
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
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
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>

            <AppFooter />
        </>
    );
}

export default Profile;