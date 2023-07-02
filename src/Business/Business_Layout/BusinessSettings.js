// React
import { useState } from 'react';
import Axios from 'axios';
// CSS
import '../Business_CSS/BusinessSettings.css';
// Material UI
import { Paper } from "@mui/material";
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
// Bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
// MDB
import { MDBFile } from 'mdb-react-ui-kit';
// Images
import avatarImg from '../../img/avatar.png';
// Icons
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";

function BusinessSettings({ businessData }) {

    const [inputBusinessAddress, setInputBusinessAddress] = useState('');
    const [inputBusinessContactNo, setInputBusinessContactNo] = useState('');
    const [inputBusinessOwnerNo, setInputBusinessOwnerNo] = useState('');
    const [inputBusinessDesc, setInputBusinessDesc] = useState('');
    const [inputBusinessWebLink, setInputBusinessWebLink] = useState('');
    const [inputBusinessOpening, setInputBusinessOpening] = useState('');
    const [inputBusinessClosing, setInputBusinessClosing] = useState('');
    const [inputBusinessNewPwd, setInputBusinessNewPwd] = useState('');
    const [inputBusinessCnfmPwd, setInputBusinessCnfmPwd] = useState('');
    const [inputBusinessSecretKey, setInputBusinessSecretKey] = useState('');
    const [inputBusinessAutoGen, setInputBusinessAutoGen] = useState(false);
    const [initChecked, setInitChecked] = useState(false);
    const [chkPwd, setChkPwd] = useState(true);
    const [succGenCode, setSuccGenCode] = useState(true);
    const [position] = useState('bottom-start');
    const [showToast, setShowToast] = useState(false);

    const randomString = require('randomstring');

    const functionGenerateRandom = () => {
        setInputBusinessSecretKey(randomString.generate(7));
        setSuccGenCode(false);
    }

    const handleAutoGen = (event) => {
        setInitChecked(event.target.checked);
        setInputBusinessAutoGen(event.target.checked);
    };

    const validatePwd = () => {
        if (inputBusinessNewPwd === inputBusinessCnfmPwd) {
            btnUpdateBusinessInfo();
            setChkPwd(true);
        } else {
            setChkPwd(false);
        }
    }

    const btnUpdateBusinessInfo = () => {

        // Generate random string
        businessData.map((value) => {
            const post_data_arr = {
                businessId: businessData[0].id,
                inputBusinessAutoGen: inputBusinessAutoGen === false ? 0 : 1,
                inputBusinessAddress: inputBusinessAddress === "" ? value.rest_address : inputBusinessAddress,
                inputBusinessContactNo: inputBusinessContactNo === "" ? value.rest_phone : inputBusinessContactNo,
                inputBusinessOwnerNo: inputBusinessOwnerNo === "" ? value.owner_phone : inputBusinessOwnerNo,
                inputBusinessDesc: inputBusinessDesc === "" ? value.rest_desc : inputBusinessDesc,
                inputBusinessWebLink: inputBusinessWebLink === "" ? value.website : inputBusinessWebLink,
                inputBusinessOpening: inputBusinessOpening === "" ? value.opening_time : inputBusinessOpening,
                inputBusinessClosing: inputBusinessClosing === "" ? value.closing_time : inputBusinessClosing,
                inputBusinessNewPwd: inputBusinessNewPwd === "" ? value.business_password : inputBusinessNewPwd,
                inputBusinessSecretKey: inputBusinessSecretKey === "" ? value.secret_key : inputBusinessSecretKey

            }
            // Calling API to backend -> update db
            Axios.put('http://localhost:3001/update_business_information', post_data_arr).then((res) => {
                if (res.status === 200){
                    setSuccGenCode(true);
                    setShowToast(true);
                }
            });
            return null;
        });
    }

    return (
        <>
            <div>
                <Paper elevation={2}>
                    <div className='admin-settings-parent-tabs'>
                        <Tabs
                            defaultActiveKey="acc-settings"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="acc-settings" title="Account Settings">
                                <div style={{ padding: '20px' }}>

                                    <Row>
                                        {
                                            businessData.map((val) => {
                                                return (
                                                    <>
                                                        <Col>

                                                            <p className='c-gray'>Business Profile Image</p>
                                                            <div style={{ display: 'flex' }}>
                                                                <img className="eatery-profile-image" src={avatarImg} alt="" style={{ height: '100px', width: '100px' }} />
                                                                <div className="mt-4" style={{ marginLeft: '50px' }}>
                                                                    <MDBFile id='customFile' />
                                                                </div>
                                                            </div>

                                                        </Col>

                                                        <Col>
                                                            <div>
                                                                <div>
                                                                    <p className='c-gray'>Account Status</p>
                                                                </div>

                                                                {

                                                                    val.approval !== 0 ? <div style={{ color: '#D5B90A', fontWeight: '500' }}>
                                                                        <BiTimeFive /> Waiting for Approval
                                                                    </div> : <div style={{ color: '#228B22', fontWeight: '500' }}>
                                                                        <AiOutlineCheckCircle /> Active
                                                                    </div>
                                                                }
                                                            </div>
                                                        </Col>
                                                    </>
                                                );
                                            })
                                        }
                                    </Row>
                                    <hr />

                                    <div>
                                        <Form>
                                            {
                                                businessData.map((val) => {
                                                    return (
                                                        <>
                                                            <Row>
                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className='c-gray'>Business Name</Form.Label>
                                                                        <Form.Control value={val.rest_name} disabled />
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className='c-gray'>Business SSM No.</Form.Label>
                                                                        <Form.Control value={val.business_SSM} disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>

                                                            <Form.Group className="mb-3">
                                                                <Form.Label className='c-gray'>Business Address</Form.Label>
                                                                <Form.Control as="textarea" style={{ resize: 'none' }} rows={3} defaultValue={val.rest_address} onChange={(e) => { setInputBusinessAddress(e.target.value) }} />
                                                            </Form.Group>

                                                            <Row>
                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className='c-gray'>Business Contact No.</Form.Label>
                                                                        <Form.Control defaultValue={val.rest_phone} onChange={(e) => { setInputBusinessContactNo(e.target.value) }} />
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className='c-gray'>Owner Contact No.</Form.Label>
                                                                        <Form.Control defaultValue={val.owner_phone} onChange={(e) => { setInputBusinessOwnerNo(e.target.value) }} />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>

                                                            <Form.Group className="mb-3">
                                                                <Form.Label className='c-gray'>Business Description</Form.Label>
                                                                <Form.Control as="textarea" style={{ resize: 'none' }} rows={3} defaultValue={val.rest_desc} onChange={(e) => { setInputBusinessDesc(e.target.value) }} />
                                                            </Form.Group>

                                                            <Form.Group className="mb-3">
                                                                <Form.Label className='c-gray'>Business Website Link</Form.Label>
                                                                <Form.Control defaultValue={val.website} onChange={(e) => { setInputBusinessWebLink(e.target.value) }} />
                                                            </Form.Group>

                                                            <Row>
                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className='c-gray'>Business Opening Time</Form.Label>
                                                                        <Form.Control defaultValue={val.opening_time} onChange={(e) => { setInputBusinessOpening(e.target.value) }} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className='c-gray'>Business Closing Time</Form.Label>
                                                                        <Form.Control defaultValue={val.closing_time} onChange={(e) => { setInputBusinessClosing(e.target.value); }} />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    );
                                                })
                                            }
                                        </Form>
                                    </div>

                                    <div className='admin-update-info-btn'>
                                        <Button variant="primary" onClick={validatePwd}>Update Information</Button>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="login-settings" title="Login & Security">
                                <p className='c-gray'>Login Information</p>

                                <div>
                                    <Row>
                                        <Col>
                                            <Form.Floating>
                                                <Form.Control
                                                    id="floatingPasswordCustom"
                                                    type="password"
                                                    placeholder="Password"
                                                    onChange={(e) => { setInputBusinessNewPwd(e.target.value) }}
                                                />
                                                <label htmlFor="floatingPasswordCustom">New Password</label>
                                            </Form.Floating>
                                        </Col>
                                        <Col>
                                            <Form.Floating>
                                                <Form.Control
                                                    id="floatingPasswordCustom"
                                                    type="password"
                                                    placeholder="Password"
                                                    onChange={(e) => { setInputBusinessCnfmPwd(e.target.value) }}
                                                />
                                                <label htmlFor="floatingPasswordCustom">Confirm Password</label>
                                            </Form.Floating>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='mt-3' hidden={chkPwd}>
                                    <Alert severity="error">Passwords does not match!</Alert>
                                </div>

                                <hr />

                                <div className='mt-3'>
                                    <p className='c-gray'>Secret Key</p>
                                    {
                                        businessData.map((val) => {
                                            return (
                                                <>
                                                    <div>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control
                                                                value={val.secret_key}
                                                                onChange={(e) => { setInputBusinessSecretKey(e.target.value) }}
                                                            />
                                                            <Button variant="dark" onClick={functionGenerateRandom}>
                                                                Regenerate Code
                                                            </Button>
                                                        </InputGroup>
                                                        <div hidden={succGenCode}>
                                                            <Alert severity="success">New Code: {inputBusinessSecretKey}</Alert>
                                                        </div>
                                                        {
                                                            val.auto_gen_key === 0 ?
                                                                <div className='secret-key-parent-div'>
                                                                    <Switch checked={initChecked} onChange={handleAutoGen} />
                                                                    <p>Auto Regenerate Key (Daily)</p>
                                                                </div> :
                                                                <div className='secret-key-parent-div'>
                                                                    <Switch checked={!initChecked} onChange={handleAutoGen} />
                                                                    <p>Auto Regenerate Key (Daily)</p>
                                                                </div>
                                                        }

                                                    </div>
                                                </>
                                            );
                                        })
                                    }
                                </div>

                                <div className='admin-update-info-btn mt-5'>
                                    <Button variant="primary" onClick={validatePwd}>Update Information</Button>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Paper>
                <ToastContainer className="position-fixed p-3" position={position}>
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide>
                        <Toast.Header >
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body>
                            <Alert severity="success">Successfully updated business information.</Alert>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </div >

        </>
    );
}

export default BusinessSettings;