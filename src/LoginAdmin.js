import AppFooter from "./AppFooter";
import './css/LoginAdmin.css';
// Images
import adminLogo from './img/admin-logo.jpg';
// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//API
import axios from "axios";
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
// Material UI
import Paper from '@mui/material/Paper';

function LoginAdmin() {

    //Const Declarations
    const navigate = useNavigate();
    //States declarations
    const [inputPassword, setInputPassword] = useState('');
    const [showErrMsg, setShowErrMsg] = useState(false);

    const adminLoginFunc = () => {
        axios.post('http://localhost:3001/login_admin', {
            inputPassword: inputPassword
        }).then((result) => {
            if (result.data.status === 200) {
                navigate("/Admin");
            }else{
                setShowErrMsg(true);
            }
        });
    }

    return (
        <>
            <div className='parent-admin-container'>
                <div className='admin-container'>
                    <Row>
                        <Col></Col>
                        <Col xs={8}>
                            <div className="mt-5">
                                <Paper>
                                    <div className="parent-paper">
                                        <Row>
                                            <Col>
                                                <div className='admin-login-form mt-5'>
                                                    <div className="admin-title">ADMIN PANEL</div>

                                                    <div className="mt-5">
                                                        <Form>
                                                        <Alert variant="danger" show={showErrMsg}>Invalid Credentials!</Alert>
                                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                                <FloatingLabel controlId="floatingPassword" label="Password">
                                                                    <Form.Control type="password" placeholder="Password" onChange={(e) => { setInputPassword(e.target.value); }} />
                                                                </FloatingLabel>
                                                            </Form.Group>
                                                            <div className="admin-btn-submit">
                                                                <Button variant="dark" className="mt-3" onClick={adminLoginFunc}>
                                                                    Login
                                                                </Button>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className='admin-bg-img'>
                                                    <img src={adminLogo} height='350px' width='350px'/>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Paper>
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
                </div>
            </div>

            <AppFooter />
        </>
    );
}

export default LoginAdmin;