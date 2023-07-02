import './css/Home.css';
// Image imports
import Burger from './img/burger.jpg';
import Pasta from './img/pasta.jpg';
import Salad from './img/salad.jpg';
import Waffles from './img/waffles.jpg';
import Pizza from './img/pizza.jpg';
// Component Import
import AppFooter from './AppFooter';
// React Imports
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Confetti from 'react-confetti'
// Bootstrap Imports
import 'bootstrap/dist/css/bootstrap.css';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Figure from 'react-bootstrap/Figure';
// Material UI
import Paper from '@mui/material/Paper';
// Icons Imports
import { BiSearchAlt, BiLike, BiDislike } from "react-icons/bi";
import { FaTrophy } from "react-icons/fa";
import { TbBuildingCarousel } from "react-icons/tb";

function Home() {
    const [eateryList, setEateryList] = useState([]);
    const [inputSearch, setInputSearch] = useState('');
    const [show, setShow] = useState(false);
    const [indexRand, setIndexRand] = useState(null);
    const [randRest, setRandRest] = useState('');
    const [randRestDesc, setRandRestDesc] = useState('');
    const [randCntLike, setRandCntLike] = useState(0);
    const [randCntDislike, setRandCntDislike] = useState(0);
    const [randId, setRandId] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const randPick = () => {
        const max = (Object.keys(eateryList).length);
        if (max > 0) {
            const min = 0;
            const max = (Object.keys(eateryList).length) - 1;
            setIndexRand(Math.floor(Math.random() * (max - min + 1)) + min);
            setRandRest(eateryList[indexRand].rest_name);
            setRandRestDesc(eateryList[indexRand].rest_desc);
            setRandCntLike(eateryList[indexRand].cnt_like);
            setRandCntDislike(eateryList[indexRand].cnt_dislike);
            setRandId(eateryList[indexRand].id);
        } else {
            setIndexRand(null);
            setRandRest('No Restaurants Available...');
        }
    }

    const validateInputSearch = () => {
        const inputSearchModified = inputSearch.split('').map(char => {
            if (char === "'") {
                return "\\" + char;
            } else {
                return char;
            }
        }).join('');

        Axios.post('http://localhost:3001/ret_list', {
            inputSearch: inputSearchModified
        }).then((res) => {
            if (res.status === 200) {
                const min = 0;
                const max = (eateryList.length) - 1;
                setEateryList(res.data);
                if (max > -1) {
                    setIndexRand(Math.floor(Math.random() * (max - min + 1)) + min);
                } else {
                    setIndexRand(null);
                }

            }
        });

    }
    useEffect(() => {
        validateInputSearch();
    });
    const [showConfetti, setShowConfetti] = useState(false);

    const handleClick = () => {
        if (indexRand != null) {
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 4000);
        }
    };

    return (
        <>
            <div className="home-container">
                <div className='testing-header'>
                    <div className='trending-header'>
                        <Container>
                            <InputGroup className="mb-3">
                                <InputGroup.Text className="icon-search"><BiSearchAlt /></InputGroup.Text>
                                <Form.Control
                                    type="search"
                                    placeholder="Search by Name or Location"
                                    className='input-search'
                                    onChange={(e) => { setInputSearch(e.target.value); }}
                                />
                            </InputGroup>
                        </Container>
                    </div>
                </div>

                <div className="trending-list mt-3">
                    <br />
                    <div className="home-title">
                        <h4 style={{ fontSize: '30px', fontWeight: '10px' }}>Top 10 Trending Eateries {inputSearch.length > 0 ? '' : 'in Malaysia'}</h4><br />
                        <div>
                            <Button variant="dark" onClick={(e) => { handleShow(e); randPick(); handleClick(); }}><TbBuildingCarousel style={{ fontSize: '20px' }} /></Button>
                        </div>
                    </div>
                    <div>
                        {showConfetti && (
                            <Confetti
                                width={window.innerWidth}
                                height={window.innerHeight}
                                numberOfPieces={1000}
                                recycle={false}
                                gravity={0.1}
                            />
                        )}
                    </div>
                    {
                        // Below is a modal to show winner for random rest
                    }
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Body>
                            <Modal.Header>
                                <Modal.Title><FaTrophy />&nbsp;&nbsp;&nbsp;Winner:</Modal.Title>
                            </Modal.Header>
                            <div>
                                <Card style={{ width: '28rem' }} className="mb-3 mt-4 mx-auto">
                                    <Card.Body>
                                        <Card.Title><a href={"/Detailed/" + randId} className='eatery-title-modal'>{randRest}</a></Card.Title>
                                        <Card.Text hidden={indexRand === null} style={{ textAlign: 'justify' }}>
                                            {randRestDesc}
                                        </Card.Text>
                                        <div className="comment-header float-end">
                                            <Badge bg="success" className="pill-like" pill hidden={indexRand === null}>
                                                <BiLike /> {randCntLike != null ? randCntLike : 0}
                                            </Badge>
                                            <Badge bg="danger" className="pill-dislike" pill hidden={indexRand === null}>
                                                <BiDislike /> {randCntDislike != null ? randCntDislike : 0}
                                            </Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={(e) => { handleShow(e); randPick(); handleClick(); }}>
                                Regenerate
                            </Button>
                            <Button variant="danger" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Paper className='mt-3'>
                        {eateryList.map((val, index) => {
                            return (
                                <> 
                                    <div style={{ padding: '15px' }}>
                                        <div className='ms-2 me-auto' style={{ textAlign: 'justify' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div className="fw-bold">
                                                    <a style={{ fontSize: '20px' }} href={"/Detailed/" + val.id} className='eatery-title'>{index + 1}. {val.rest_name}</a>
                                                </div>
                                                <div className="trending-vote ml-3">
                                                    <Badge className="pill-like" pill>
                                                        <BiLike /> {val.cnt_like != null ? val.cnt_like : 0}
                                                    </Badge>
                                                    <Badge className="pill-dislike" pill>
                                                        <BiDislike /> {val.cnt_dislike != null ? val.cnt_dislike : 0}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className='rest_add'>{val.rest_address} | {val.cnt_like + val.cnt_dislike} reviews</p>
                                            {val.rest_desc}
                                        </div>
                                    </div>
                                    <div style={{ margin: '1%', display: 'flex', justifyContent: 'space-evenly' }}>
                                        
                                            <Figure className='m-inherit'>
                                                <Figure.Image
                                                    width={300}
                                                    height={300}
                                                    alt="171x180"
                                                    src={Burger}
                                                    className='img-home'
                                                />
                                            </Figure>
                                            <Figure className='m-inherit'>
                                                <Figure.Image
                                                    width={300}
                                                    height={300}
                                                    alt="171x180"
                                                    src={Pasta}
                                                    className='img-home'
                                                />
                                            </Figure>
                                            <Figure className='m-inherit'>
                                                <Figure.Image
                                                    width={300}
                                                    height={300}
                                                    alt="171x180"
                                                    src={Salad}
                                                    className='img-home'
                                                />
                                            </Figure>
                                            <Figure className='m-inherit'>
                                                <Figure.Image
                                                    width={300}
                                                    height={300}
                                                    alt="171x180"
                                                    src={Waffles}
                                                    className='img-home'
                                                />
                                            </Figure>
                                            <Figure className='m-inherit'>
                                                <Figure.Image
                                                    width={300}
                                                    height={300}
                                                    alt="171x180"
                                                    src={Pizza}
                                                    className='img-home'
                                                />
                                            </Figure>          
                                    </div>
                                    <hr />
                                </>
                            );
                        })}
                    </Paper>
                </div>
            </div>

            <AppFooter />
        </>
    );
}

export default Home;
