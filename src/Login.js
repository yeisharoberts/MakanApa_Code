import './App.css';
import AppFooter from './AppFooter';
import './css/Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Axios from 'axios';


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState(false);
    const [linkBusiness] = useState(<Link to="/LoginBusiness" className="register-business-link">I'm a Business Owner</Link>);
    const [linkAdmin] = useState(<Link to="/LoginAdmin" className="register-business-link">Admin</Link>);

    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const loginUser = () => {
        Axios.post('http://localhost:3001/login_action', {
            username: username,
            password: password,
        }).then((res) => {
            if (res.data.status === 401) {
                setErrMsg(true);
            } else {
                navigate("/");
            }
        });
    };

    return (
        <>
            <div className="parent-login">
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={7}>
                            <Tabs
                                defaultActiveKey="type-user"
                                className="mb-3 mt-5"
                            >
                                <Tab eventKey="type-user" title="I'm a User">
                                    <Card className="card">
                                        <Card.Body>
                                            <Card.Title>Login</Card.Title><br></br>
                                            <Form>
                                                <Alert variant="danger" show={errMsg}>
                                                    Invalid Credentials!
                                                </Alert>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Username" onChange={(e) => { setUsername(e.target.value); }} />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value); }} />
                                                </Form.Group>

                                                <Form.Text className="text-muted">
                                                    Don't have an account? Click <Link to="/Register">here</Link> to create!
                                                </Form.Text><br></br>

                                                <Button variant="primary" className="float-end" onClick={loginUser}>Login</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab>

                                <Tab eventKey="type-business" title={linkBusiness}>
                                </Tab>

                                <Tab eventKey="type-admin" title={linkAdmin}>
                                </Tab>
                            </Tabs>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
            <AppFooter />
        </>
    );
}

export default Login;