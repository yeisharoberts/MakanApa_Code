import React, { Component, useState } from "react";
import Slider from "react-slick";
import '../Admin_CSS/AdminRestRanks.css';
import ListGroup from 'react-bootstrap/ListGroup';

export default class AdminRestRanks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restList: props.resList
        };
    }

    render() {
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

        return (
            <div className='slider-component'>
                <Slider {...settings}>
                    {this.state.restList.map((element, index) => {
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
        );
    }
}