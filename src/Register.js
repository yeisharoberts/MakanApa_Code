import AppFooter from './AppFooter';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Axios from 'axios';
import { MDBFile } from 'mdb-react-ui-kit';

import './css/Register.css';

function Register() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [succAlert, setSuccAlert] = useState(false);
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    //validation error message
    const [emailErr, setEmailErr] = useState(false);
    const [empInput, setEmpInput] = useState(false);

    const validateInputs = () => {
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let regexTest = regex.test(email);

        if(email.length < 1 || firstName.length < 1 || lastName.length < 1 || username.length < 1 || password.length < 1){
            setEmpInput(true);
        }else if(regexTest === false){
            setEmailErr(true);
            setEmpInput(false);
        }else{
            registerUser();
        }
    }

    const registerUser = () => {
        Axios.post('http://localhost:3001/register_action', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: password,
            image: image
        }).then((res) => {
            if (res.status === 200) {
                console.log(res);
                setSuccAlert(true);
                setTimeout(() => {
                    navigate('/Login');
                }, 1000);
            }
        });
    };

    const handleChange = (e) => {
        setImage(e.target.value);
    };

    return (
        <>
            <div className="parent-register">
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={6}>
                            <Card className={!succAlert ? 'card-t' : 'card-f'}>
                                <Card.Body>
                                <Alert variant='danger' show={empInput}>Please fill in all input fields!</Alert>
                                    <Form>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control placeholder="Enter First Name" onChange={(e) => { setFirstName(e.target.value); }} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control placeholder="Enter Last Name" onChange={(e) => { setLastName(e.target.value); }} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="Enter Email" onChange={(e) => { setEmail(e.target.value); }} required/>
                                        </Form.Group>
                                        <p class='emailErr' hidden={!emailErr}>You have entered an invalid email address!</p>
                                        <Form.Group className="mb-3">
                                            <Form.Label htmlFor="inlineFormInputGroup">
                                                Username
                                            </Form.Label>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Text>@</InputGroup.Text>
                                                <Form.Control id="inlineFormInputGroup" placeholder="Enter Username" onChange={(e) => { setUsername(e.target.value); }} />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value); }} />
                                        </Form.Group>

                                        <div>
                                            <MDBFile label='Upload Image' id='customFile' onChange={handleChange} />
                                        </div><br />

                                        <Form.Text className="text-muted">
                                            Already have an account? Click <Link to="/Login">here</Link> to login!
                                        </Form.Text><br />

                                        <Button variant="success" className="float-end" onClick={validateInputs}>
                                            Create Account
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
                <ToastContainer className="position-fixed p-3" position='bottom-start'>
                    <Toast onClose={() => setSuccAlert(false)} show={succAlert} delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Success</strong>
                            <small>now</small>
                        </Toast.Header>
                        <Toast.Body>
                            <Alert variant="success">Registration Successful.</Alert>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
            <AppFooter />
        </>
    );
}

export default Register;