// React
import { useState, useEffect } from 'react';
import './css/AdminBusinessApproval.css';
// API 
import axios from 'axios';
// Material UI
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
// Bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Badge from 'react-bootstrap/Badge';
// import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function AdminBusinessApproval() {

    // State declaration
    const [businessList, setBusinessList] = useState([]);
    const [businessData, setBusinessData] = useState([]);
    const [succApproval, setSuccApproval] = useState(false);
    const [succReject, setSuccReject] = useState(false);


    const [cnfmApproval, setCnfmApproval] = useState(false);

    const handleCnfmApprovalClose = () => setCnfmApproval(false);
    const handleCnfmApprovalShow = (data) => {
        setBusinessData(data);
        setCnfmApproval(true)
    };

    // Show modal for rejecting business 
    const [cnfmReject, setCnfmReject] = useState(false);

    const handleCnfmRejectClose = () => setCnfmReject(false);
    const handleCnfmRejectShow = (data) => {
        setBusinessData(data);
        setCnfmReject(true)
    };

    // Show modal to display business details
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    function handleApproval(data) {
        axios.put('http://localhost:3001/updateBusinessApproval', {
            businessId: data.id,
            approval: 0
        }).then((res) => {
            if (res.status === 200) {
                setSuccApproval(true);
                setCnfmApproval(false);
            }
        });
    }

    function handleReject(data) {
        axios.delete('http://localhost:3001/deleteBusinessReg/' + data.id).then((res) => {
            if (res.status === 200) {
                setCnfmReject(false);
                setSuccReject(true);
            }
        });
    }

    function getBusinessList() {
        axios.get('http://localhost:3001/getBusinesList').then((res) => {
            setBusinessList(res.data);
        });
    }

    const handleShowDetailModal = (data) => {
        setBusinessData(data);
        setShow(true);
    }

    useEffect(() => {
        getBusinessList();
    });

    return (
        <>
            <div className='parent-business-approval'>
                <div className='row-header'>
                    <Tabs
                        defaultActiveKey="account-pending"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="account-pending" title="Pending">
                            <Paper>
                                <div className='parent-table'>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Business SSM</th>
                                                <th>Business Name</th>
                                                <th>Business Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                businessList.filter(business => business.approval === 1).map(val => (
                                                    <>
                                                        <tr key={val.business_SSM}>
                                                            <td className='business-ssm' onClick={() => { handleShowDetailModal(val) }}>{val.business_SSM}</td>
                                                            <td>{val.rest_name}</td>
                                                            <td>{val.rest_desc}</td>
                                                            <td>
                                                                <DropdownButton id="dropdown-basic-button" title="Select Action" variant="warning">
                                                                    <Dropdown.Item onClick={() => { handleCnfmApprovalShow(val) }}>Approve</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => { handleCnfmRejectShow(val) }}>Reject</Dropdown.Item>
                                                                </DropdownButton>
                                                            </td>
                                                            <Modal show={cnfmApproval} onHide={handleCnfmApprovalClose}>
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title>Confirm Approval</Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    <Alert key='warning' variant='warning'>
                                                                        Confirm approve registration request for {businessData.rest_name}?
                                                                    </Alert>
                                                                </Modal.Body>
                                                                <Modal.Footer>
                                                                    <Button variant="contained" color="success" onClick={() => { handleApproval(val) }}>
                                                                        Approve
                                                                    </Button>
                                                                </Modal.Footer>
                                                            </Modal>

                                                            <Modal show={cnfmReject} onHide={handleCnfmRejectClose}>
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title>Confirm Rejection</Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    <Alert variant='warning'>
                                                                        Confirm reject registration request for {businessData.rest_name}? This action cannot be undone.
                                                                    </Alert>
                                                                </Modal.Body>
                                                                <Modal.Footer>
                                                                    <Button variant='contained' color="error" onClick={() => { handleReject(val) }}>
                                                                        Reject
                                                                    </Button>
                                                                </Modal.Footer>
                                                            </Modal>
                                                        </tr>
                                                    </>
                                                ))
                                            }

                                        </tbody>
                                    </Table>
                                </div>
                            </Paper>
                        </Tab>
                        <Tab eventKey="account-approved" title="Approved">
                            <Paper>
                                <div className='parent-table'>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Business SSM</th>
                                                <th>Business Name</th>
                                                <th>Business Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                businessList.filter(business => business.approval === 0).map(val => (
                                                    <>
                                                        <tr key={val.business_SSM}>
                                                            <td>{val.business_SSM}</td>
                                                            <td>{val.rest_name}</td>
                                                            <td style={{ textAlign: 'justify' }}>{val.rest_desc}</td>
                                                        </tr>
                                                    </>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Paper>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton />

                <Modal.Body>
                    <div>
                        <div className='c-gray mt-2'>Business SSM: </div>
                        {businessData.business_SSM}

                        <div className='c-gray mt-2'>Business Name: </div>
                        {businessData.rest_name}

                        <div className='c-gray mt-2'>Business Description: </div>
                        <div className='ta-j'>{businessData.rest_desc}</div>

                        <div className='c-gray mt-2'>Business Address: </div>
                        <div className='ta-j'>{businessData.rest_address}</div>

                        <div className='c-gray mt-2'>Business Phone: </div>
                        {businessData.rest_phone}

                        <div className='c-gray mt-2'>Business Owner Phone: </div>
                        {businessData.owner_phone}

                        <div className='c-gray mt-2'>Business Website: </div>
                        {businessData.website}

                        <div className='c-gray mt-2'>Business Hours: </div>
                        {businessData.opening_time} - {businessData.closing_time}

                    </div>
                </Modal.Body>
            </Modal>

            <ToastContainer className="position-fixed p-3" position='bottom-start'>
                <Toast onClose={() => setSuccApproval(false)} show={succApproval} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                        <small>now</small>
                    </Toast.Header>
                    <Toast.Body>
                        <Alert variant="success">Business Registration Approved.</Alert>
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <ToastContainer className="position-fixed p-3" position='bottom-start'>
                <Toast onClose={() => setSuccReject(false)} show={succReject} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                        <small>now</small>
                    </Toast.Header>
                    <Toast.Body>
                        <Alert variant="success">Business Registration Rejected.</Alert>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default AdminBusinessApproval;