import AppFooter from "./AppFooter";
import './css/LoginBusiness.css';
import ACTION from './Actions';
import { Link, useNavigate } from "react-router-dom";
import { useReducer } from "react";
import Axios from 'axios';
// Bootstrap Imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION.EMPTY_ERROR:
            return { ...state, emp_err: true, invalidCred: false };
        case ACTION.INPUT_BUSINESS_SSM:
            return { ...state, businessSSM: action.payload };
        case ACTION.INPUT_PASSWORD:
            return { ...state, password: action.payload };
        case ACTION.INVALID_CREDENTIALS:
            return {...state, invalidCred: true, emp_err: false};
        default:
            return state
    }
};

function LoginBusiness() {
    const [state, dispatch] = useReducer(reducer, { emp_err: false, businessSSM: '', password: '', invalidCred: false });
    const navigate = useNavigate();

    const validateInput = () => {
        if (state.businessSSM.length === 0 || state.password.length === 0) {
            dispatch({ type: ACTION.EMPTY_ERROR });
        } else {
            Axios.post('http://localhost:3001/login_business', {
                businessSSM: state.businessSSM,
                password: state.password
            }).then((res) => {
                if (res.data.status === 401) {
                    dispatch({ type: ACTION.INVALID_CREDENTIALS });
                } else {
                    navigate("/Business");
                }
            });
        }
    };

    return (
        <>
            <div className="parent-login-business">
                <div>
                    <Container>
                        <Row>
                            <Col></Col>
                            <Col xs={5}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Login for Business</Card.Title><br />
                                        <Alert variant="danger" show={state.emp_err}>
                                            Please fill in both input fields!
                                        </Alert>
                                        <Alert variant="danger" show={state.invalidCred}>
                                            Invalid Credentials!
                                        </Alert>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Registered SSM No.</Form.Label>
                                                <Form.Control placeholder="Enter SSM No." onChange={(e) => dispatch({ type: ACTION.INPUT_BUSINESS_SSM, payload: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Enter Password" onChange={(e) => dispatch({ type: ACTION.INPUT_PASSWORD, payload: e.target.value })} />
                                            </Form.Group>

                                            <Form.Text className="text-muted">
                                                Don't have an account? Click <Link to="/RegisterBusiness">here</Link> to register your business!
                                            </Form.Text><br /><br />

                                            <Button variant="dark" className="float-end" onClick={validateInput}>
                                                Login
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <AppFooter />
        </>
    );
}

export default LoginBusiness;