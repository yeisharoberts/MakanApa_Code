import './css/AdminDashboard.css';
// React
import { useEffect, useState } from 'react';
import axios from 'axios';
// Material UI
import Paper from '@mui/material/Paper';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Component 
import Slider from "react-slick";
// Icons
import { HiUserAdd } from "react-icons/hi";
import { BsBuilding } from "react-icons/bs";

function AdminDashboard() {
    const [resList, setResList] = useState([]);
    const [regUsers, setRegUsers] = useState([]);
    const [approvedBusiness, setApprovedBusiness] = useState([]);

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

    const getRestaurantRank = () => {
        axios.get('http://localhost:3001/business_ret_list').then((res) => {
            setResList(res.data);
        });
    }

    const getRegisteredUser = () => {
        axios.get('http://localhost:3001/admin_getRegisteredUser').then((res) => {
            setRegUsers(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    const getApprovedBusiness = () => {
        axios.get('http://localhost:3001/admin_getApprovedBusiness').then((res) => {
            setApprovedBusiness(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getRestaurantRank();
        getRegisteredUser();
        getApprovedBusiness();
    }, [resList, regUsers, approvedBusiness]);

    return (
        <>
            <div>
                <div>
                    <div>
                        <Row>
                            <Col>
                                <Paper variant="outlined" className='paper-users-registered'>
                                    <div className='parent-users-registered p-20'>
                                        <Row>
                                            <Col>
                                                <div className='users-icon'>
                                                    <HiUserAdd />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className='display-registered'>
                                                    Users Registered
                                                </div>
                                                <div className='display-number'>
                                                    {regUsers.length}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Paper>
                            </Col>
                            <Col>
                                <Paper variant="outlined" className='paper-business-registered'>
                                    <div className='parent-users-registered p-20'>
                                        <Row>
                                            <Col>
                                                <div className='users-icon'>
                                                    <BsBuilding />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className='display-registered'>
                                                    Business Registered
                                                </div>
                                                <div className='display-number'>
                                                    {approvedBusiness.length}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Paper>
                            </Col>
                        </Row>

                        <div className='mt-5 mb-5'>
                            <Paper>
                                <div className='admin-slider-component'>
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
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;