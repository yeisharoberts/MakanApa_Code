import './css/EateryDetail.css';
import AppFooter from './AppFooter';
//Image Imports
import avatarImg from './img/mrbean.jpg';
import Burger from './img/burger.jpg';
import Pasta from './img/pasta.jpg';
import Salad from './img/salad.jpg';
import Waffles from './img/waffles.jpg';
import Pizza from './img/pizza.jpg';
// React Func Imports
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Sentiment from 'sentiment';
import moment from 'moment';
// Bootstrap Imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

// Images Imports
import image from './img/leaf.jpg';
// Icons Imports
import { BiMap, BiPhone, BiTimeFive, BiWindowAlt, BiCommentAdd, BiLike, BiDislike } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";
import { TfiWrite } from "react-icons/tfi";
import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { RiEmotionHappyLine } from "react-icons/ri";
import { FaRegAngry } from "react-icons/fa";
import { ImNeutral } from "react-icons/im";
import { BsFilterLeft } from "react-icons/bs";

function EateryDetail() {
    const [initReviews, setInitReviews] = useState([]);
    const { id } = useParams();
    const [countRevs, setCountRevs] = useState(0);
    const [restInfo, setRestInfo] = useState([]);
    const [restReviews, setReviews] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [codeValid, setCodeValid] = useState(false);
    const [secKey, setSecKey] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [inputLike, setInputLike] = useState(0);
    const [inputDislike, setInputDislike] = useState(0);
    const [inputComment, setInputComment] = useState("");
    const [restId, setRestId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [written, setWritten] = useState(false);
    const [errCodeMsg, setCodeErrMsg] = useState(false);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState(1);
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const pageNumbers = [];
    //Sentiment
    const sentiment = new Sentiment();
    const [sentimentScore, setSentimentScore] = useState(0);
    const [sentModal, setSentModal] = useState(false);
    const closeSentModal = () => setSentModal(false);
    //After Review Modal Pop Up
    const [reviewFeedback, setReviewFeedback] = useState("");

    const handleShow = () => setShow(true);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    for (let i = 1; i <= Math.ceil(initReviews.length / reviewsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleClose = () => {
        setShow(false);
        setCodeValid(false);
    }

    const verifyCode = () => {
        if (inputCode === secKey) {
            setCodeValid(true);
            setCodeErrMsg(false);
        } else {
            setCodeErrMsg(true);
        }
    }

    const postReview = () => {
        const result = sentiment.analyze(inputComment);
        Axios.post('http://localhost:3001/post_review', {
            comment: inputComment,
            like: inputLike,
            dislike: inputDislike,
            rest_id: restId,
            user_id: userId,
            sentimentScore: result.score,
            timestamp: new Date().toISOString().slice(0, 10)
        }).then((res) => {
            if (res.status === 200) {
                handleClose();
                setSentimentScore(res.data.sentiment_score);
                setSentModal(true);
                evalComment();
            }
        });
    };

    const postFeedback = () => {
        for (let val of restReviews) {
            if (val.user_id === userId) {
                Axios.post('http://localhost:3001/post_feedback', {
                    review_id: val.review_id,
                    feedback: reviewFeedback
                });
            }
        }
    };

    //RENDER REVIEW SENTIMENT MODAL
    let modalBody;
    const evalComment = () => {
        if (sentimentScore > 0) {
            modalBody =
                restInfo.map((val) => {
                    return (
                        <Modal show={sentModal} onHide={closeSentModal}>
                            <Modal.Header closeButton>
                                <Modal.Title><RiEmotionHappyLine /></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert key='success' variant='success'>
                                    Thank you for sharing your experience with us! {val.rest_name} hope to see you again soon!
                                </Alert>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="dark" onClick={closeSentModal}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    );
                })
        } else if (sentimentScore < 0) {
            modalBody =
                restInfo.map((val) => {
                    return (
                        <Modal show={sentModal} onHide={closeSentModal}>
                            <Modal.Header closeButton>
                                <Modal.Title><FaRegAngry /></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert key='danger' variant='danger'>
                                    Sorry for the bad experience! Let {val.rest_name} know how they can be improved:
                                </Alert>
                                <br /><br />
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Control as="textarea" rows={5} style={{ resize: 'none' }} onChange={(e) => { setReviewFeedback(e.target.value); }} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={(e) => { postFeedback(e); closeSentModal() }}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    );
                })
        } else {
            modalBody =
                restInfo.map((val) => {
                    return (
                        <Modal show={sentModal} onHide={closeSentModal}>
                            <Modal.Header closeButton>
                                <Modal.Title><ImNeutral /></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert key='info' variant='info'>
                                    Thank you for the review! Let {val.rest_name} know how they can be improved:
                                </Alert>
                                <br /><br />
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Control as="textarea" rows={5} style={{ resize: 'none' }} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="dark" onClick={(e) => { postFeedback(e); closeSentModal() }}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    );
                })
        }
    }

    evalComment();

    useEffect(() => {
        Axios.get("http://localhost:3001/login_action").then((res) => {
            if (res.data.loggedIn === true) {
                setLoggedIn(true);
                setUserId(res.data.user[0].id);
            } else {
                setLoggedIn(false);
            }
        });

        Axios.post('http://localhost:3001/ret_info', {
            rest_id: id
        }).then((res) => {
            setRestInfo(res.data);
            setSecKey(res.data[0].secret_key);
            setRestId(res.data[0].id);
        });

        Axios.post('http://localhost:3001/ret_reviews', {
            rest_id: id
        }).then((res) => {
            // Get current reviews
            let temp_initReviews = res.data;
            // use this method to avoid being in an infinite loop
            let filteredReviews = temp_initReviews.filter(value => {
                if (value.review_sentiment > 0 && filter === 2) {
                    return true;
                } else if (value.review_sentiment < 0 && filter === 4) {
                    return true;
                } else if (value.review_sentiment === 0 && filter === 3) {
                    return true;
                } else if (filter === 1) {
                    return true;
                } else {
                    return false;
                }
            });
            setInitReviews(filteredReviews);
            const indexOfLastReview = currentPage * reviewsPerPage; // 3
            const indexOfFirstReview = indexOfLastReview - reviewsPerPage; //0
            const setGetReview = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
            
            setReviews(setGetReview);
            setCountRevs(Object.keys(setGetReview).length);
        });

        restReviews.map((val) => {
            return (val.rest_id === parseInt(id) && val.user_id === userId) ? setWritten(true) : null;
        });

    }, [restReviews, countRevs, written, currentPage, id, initReviews, reviewsPerPage, userId, filter]);

    return (
        <>
            {modalBody}

            <div className="eatery-detail">
                <div className='container-class'>
                    <Row>
                        <Col xs={5}>
                            <Card className="detail-card">
                                {restInfo.map((val) => {
                                    return (
                                        <Card.Body>
                                            <h3>{val.rest_name}</h3><br />
                                            <Carousel>
                                                <Carousel.Item interval={5000}>
                                                    <img
                                                        className="d-block w-100 img-detail"
                                                        src={Burger}
                                                        alt="First slide"
                                                    />
                                                </Carousel.Item>
                                                <Carousel.Item interval={5000}>
                                                    <img
                                                        className="d-block w-100 img-detail"
                                                        src={Pasta}
                                                        alt="Second slide"
                                                    />
                                                </Carousel.Item>
                                                <Carousel.Item interval={5000}>
                                                    <img
                                                        className="d-block w-100 img-detail"
                                                        src={Salad}
                                                        alt="Third slide"
                                                    />
                                                </Carousel.Item>
                                                <Carousel.Item interval={5000}>
                                                    <img
                                                        className="d-block w-100 img-detail"
                                                        src={Waffles}
                                                        alt="Third slide"
                                                    />
                                                </Carousel.Item>
                                                <Carousel.Item interval={5000}>
                                                    <img
                                                        className="d-block w-100 img-detail"
                                                        src={Pizza}
                                                        alt="Third slide"
                                                    />
                                                </Carousel.Item>
                                            </Carousel>
                                            <div className="rest-dets">
                                                <h6 className="rest-desc">{val.rest_desc}</h6><br />
                                                <p><BiMap />&nbsp;&nbsp;{val.rest_address}</p>
                                                <p><BiPhone />&nbsp;&nbsp;{val.rest_phone}</p>
                                                <p className="p-time"><BiTimeFive />&nbsp;&nbsp;{val.opening_time + " - " + val.closing_time}</p>
                                                <p><BiWindowAlt />&nbsp;&nbsp;<a className="p-website" href={val.website}>{val.website}</a></p>
                                            </div>
                                        </Card.Body>
                                    );
                                })}
                            </Card>
                        </Col>
                        <Col>
                            <Card className="detail-card-review" style={{ backgroundColor: '#142831 !important' }}>
                                <Card.Body>
                                    <div className="rev-head">
                                        <h1 className="rev-title">Reviews ({countRevs})</h1>
                                        <h3 className="rev-create" onClick={handleShow} hidden={written}><BiCommentAdd /></h3>
                                    </div>
                                </Card.Body>
                                <div className="parent-filter">
                                    <InputGroup className="mb-3 filter-row">
                                        <DropdownButton variant="light" title={<BsFilterLeft className="filter-icon" />}>
                                            <Dropdown.Item href="#!" onClick={(e) => { setFilter(1); }}>&nbsp;&nbsp;All</Dropdown.Item>
                                            <Dropdown.Item href="#!" onClick={(e) => { setFilter(2); }}><RiEmotionHappyLine className="filter-happy" />&nbsp;&nbsp;Positive</Dropdown.Item>
                                            <Dropdown.Item href="#!" onClick={(e) => { setFilter(3); }}><ImNeutral />&nbsp;&nbsp;&nbsp;Neutral</Dropdown.Item>
                                            <Dropdown.Item href="#!" onClick={(e) => { setFilter(4); }}><FaRegAngry />&nbsp;&nbsp;&nbsp;Negative</Dropdown.Item>
                                        </DropdownButton>
                                    </InputGroup>
                                </div>
                                {restReviews.map((val) => {
                                    return (
                                        <div className="post-review">
                                            <div className="post-content">
                                                <div className="comment-header">

                                                    <div className="user-image">
                                                        <img src={avatarImg} alt="" width="50" height="50" style={{ borderRadius: '50%' }} />
                                                    </div>&nbsp;&nbsp;&nbsp;

                                                    <div className="user-username">@{val.username}<br /><div className="posted-date">Posted on: {moment(val.review_timestamp).format("DD/MM/YYYY")}</div></div>
                                                </div><br />
                                                <p className="comment-desc">
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
                                        </div>
                                    );
                                })}
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
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* CREATE REVIEW MODAL COMPONENT */}
            {loggedIn ?
                //POST REVIEW MODAL
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title><TfiWrite />Write a Review!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant='danger' show={errCodeMsg}>
                            Wrong code! Please try again.
                        </Alert>
                        <div hidden={codeValid}>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Enter Code"
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    onChange={(e) => { setInputCode(e.target.value); }}
                                />
                                <Button variant="secondary" onClick={verifyCode}>
                                    Verify
                                </Button>
                            </InputGroup>
                        </div>
                        <div hidden={!codeValid}>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px', resize: 'none' }}
                                        onChange={(e) => { setInputComment(e.target.value); }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Rating</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Button variant={inputLike === 1 ? 'success' : 'light'} onClick={() => { setInputLike(1); setInputDislike(0) }}><HiOutlineHandThumbUp /></Button>
                                        <Button variant={inputDislike === 1 ? 'danger' : 'light'} onClick={() => { setInputDislike(1); setInputLike(0) }}><HiOutlineHandThumbDown /></Button>
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer hidden={!codeValid}>
                        <Button variant="dark" onClick={postReview}>
                            Post
                        </Button>
                    </Modal.Footer>
                </Modal> :
                //REGISTER/LOGIN TO CONTINUE MODAL
                <div>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="danger"><CgDanger />&nbsp;&nbsp;Not Logged In</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Please <a href="/Login">login</a> or <a href="/Register">register</a> to continue.</Modal.Body>
                    </Modal>
                </div>}
            <AppFooter />
        </>
    );
}

export default EateryDetail;