import AppFooter from "./AppFooter";
import './css/RegisterBusiness.css';
import ACTION from "./Actions";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
// Bootstrap Imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION.INPUT_BUSINESS_NAME:
            return { ...state, businessName: action.payload };
        case ACTION.INPUT_BUSINESS_SSM:
            return { ...state, businessSsm: action.payload };
        case ACTION.INPUT_BUSINESS_PWD:
            return { ...state, businessPwd: action.payload };
        case ACTION.INPUT_BUSINESS_ADD:
            return { ...state, businessAddress: action.payload };
        case ACTION.INPUT_BUSINESS_DESC:
            return { ...state, businessDesc: action.payload };
        case ACTION.INPUT_BUSINESS_PHONE:
            return { ...state, businessPhone: action.payload };
        case ACTION.INPUT_OWNER_PHONE:
            return { ...state, ownerPhone: action.payload };
        case ACTION.INPUT_BUSINESS_WEB:
            return { ...state, businessWebsite: action.payload };
        case ACTION.INPUT_BUSINESS_OPENING:
            return { ...state, businessOpening: action.payload };
        case ACTION.INPUT_BUSINESS_CLOSING:
            return { ...state, businessClosing: action.payload };
        case ACTION.INPUT_VALIDATION:
            return { ...state, showErrMsg: true };
        case ACTION.REGISTER_SUCCESS:
            return { ...state, register_succ: true };
        default:
            return state;
    }
};

function RegisterBusiness() {
    const [state, dispatch] = useReducer(reducer, { businessName: '', businessSsm: '', businessPwd: '', businessAddress: '', businessDesc: '', businessPhone: '', ownerPhone: '', businessWebsite: '', businessOpening: '', businessClosing: '', register_succ: false, showErrMsg: false });
    const navigate = useNavigate();

    const registerBusiness = () => {
        const inputNull = Object.keys(state).filter(key => state[key].length === 0);
        if (inputNull.length === 0) {
            Axios.post('http://localhost:3001/register_business', {
                rest_name: state.businessName,
                business_SSM: state.businessSsm,
                business_password: state.businessPwd,
                rest_address: state.businessAddress,
                rest_desc: state.businessDesc,
                rest_phone: state.businessPhone,
                owner_phone: state.ownerPhone,
                website: state.businessWebsite,
                opening_time: state.businessOpening,
                closing_time: state.businessClosing
            }).then((res) => {
                if (res.data.code === 200) {
                    dispatch({ type: ACTION.REGISTER_SUCCESS });
                }
            });
        }else{
            dispatch({ type: ACTION.INPUT_VALIDATION });
        }
    };

    const succ_redirect = () => {
        navigate("/LoginBusiness");
    };

    return (
        <>
            <div className="parent-registerBusiness">
                <Container className="mb-5">
                    <Row>
                        <Col></Col>
                        <Col xs={8}>
                            <div className="parent-form">

                                <Modal show={state.register_succ}>
                                    <Modal.Body>
                                        <Alert variant="success">
                                            <p style={{ fontWeight: '700' }}>You're almost there!</p>
                                            <p>Please wait within 2-3 business days for your registration to be approved.</p>
                                        </Alert>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="success" onClick={succ_redirect}>
                                            OK
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Card>
                                    <Card.Body>

                                        <Alert variant="secondary">
                                            <p className="alert-business-title">Register your Business!</p>
                                            <p>Note that your business will only be successfully registered upon confirmation by MakanApa.</p>
                                            <p>Please ensure that all details filled are correct and valid to avoid being rejected.</p>
                                        </Alert>

                                        <Alert variant="danger" show={state.showErrMsg}>
                                            Please fill in all details!
                                        </Alert>

                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Business Name</Form.Label>
                                                <Form.Control placeholder="Enter Business Name" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_NAME, payload: e.target.value })} />
                                            </Form.Group>

                                            <Row>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Registered SSM No.</Form.Label>
                                                        <Form.Control placeholder="Enter Registered SSM No." onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_SSM, payload: e.target.value })} />
                                                    </Form.Group>
                                                </Col>

                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Set Up Password</Form.Label>
                                                        <Form.Control type="password" placeholder="Enter Password" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_PWD, payload: e.target.value })} />
                                                    </Form.Group>

                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Business Address</Form.Label>
                                                <Form.Control as="textarea" rows={3} style={{ resize: 'none' }} placeholder="Enter Business Address" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_ADD, payload: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Business Description</Form.Label>
                                                <Form.Control as="textarea" rows={3} style={{ resize: 'none' }} placeholder="Enter Business Description" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_DESC, payload: e.target.value })} />
                                            </Form.Group>

                                            <Row>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Business Phone No.</Form.Label>
                                                        <Form.Control placeholder="Enter Business Phone No." onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_PHONE, payload: e.target.value })} />
                                                    </Form.Group>
                                                </Col>

                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Owner Phone No.</Form.Label>
                                                        <Form.Control placeholder="(e.g. 012-3456789)" onChange={(e) => dispatch({ type: ACTION.INPUT_OWNER_PHONE, payload: e.target.value })} />
                                                    </Form.Group>

                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Business Website</Form.Label>
                                                <Form.Control placeholder="Enter Business Website" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_WEB, payload: e.target.value })} />
                                            </Form.Group>

                                            <Row>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Business Opening Hour</Form.Label>
                                                        <Form.Control placeholder="(e.g. 9 am)" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_OPENING, payload: e.target.value })} />
                                                    </Form.Group>
                                                </Col>

                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Business Closing Hour</Form.Label>
                                                        <Form.Control placeholder="(e.g. 10 pm)" onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_CLOSING, payload: e.target.value })} />
                                                    </Form.Group>

                                                </Col>
                                            </Row>

                                            <Form.Text className="text-muted">
                                                Already have an account? Click <Link to="/LoginBusiness">here</Link> to login!
                                            </Form.Text><br /><br />

                                            <Button variant="dark" className="float-end" onClick={registerBusiness}>
                                                Submit
                                            </Button>

                                        </Form>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
            <AppFooter />
        </>
    );
}

export default RegisterBusiness;