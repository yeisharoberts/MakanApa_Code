import './css/AdminReportRequest.css';
import avatarImg from '../img/avatar.png'
// React
import { useState, useEffect } from 'react';
// API 
import axios from 'axios';
// Material UI
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
// Icons
import { FaTrash, FaEyeSlash } from "react-icons/fa";

function AdminReportRequest() {
    const [reportData, setReportData] = useState([]);
    const [succIgnore, setSuccIgnore] = useState(false);
    const [succDelete, setSuccDelete] = useState(false);
    const [deleteData, setDeleteData] = useState([]);
    const [ignoreData, setIgnoreData] = useState([]);

    const [showIgnoreConfirmation, setShowIgnoreConfirmation] = useState(false);
    const handleShowIgnoreConfirmation = (data) => { setShowIgnoreConfirmation(true); setIgnoreData(data); }
    const handleCloseIgnoreConfirmation = () => { setShowIgnoreConfirmation(false); }

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const handleShowDeleteConfirmation = (data) => { setShowDeleteConfirmation(true); setDeleteData(data); }
    const handleCloseDeleteConfirmation = () => { setShowDeleteConfirmation(false); }

    function getReviewReports() {
        axios.get('http://localhost:3001/getReviewReports').then((res) => {
            if (res.status === 200) {
                setReportData(res.data);
            }
        });
    }

    const handleIgnoreReport = () => {
        axios.delete('http://localhost:3001/ignoreReport/' + ignoreData.report_id).then((res) => {
            if (res.status === 200) {
                setSuccIgnore(true);
                setShowIgnoreConfirmation(false);
            }
        });
    }

    const handleDeleteReport = () => {
        axios.post('http://localhost:3001/deleteReport', {
            reviewId: deleteData.review_id,
        }).then((res) => {
            if (res.status === 200) {
                setSuccDelete(true);
                setShowDeleteConfirmation(false);
            }
        });
    }

    useEffect(() => {
        getReviewReports();
    });

    return (
        <>
            <div className="parent-report-request">
                <div className='mb-4 reviews-reported'>Reviews Reported ({reportData.length})</div>

                {
                    reportData.map((val) => {
                        return (
                            <>
                                <div className='mt-3'>
                                    <Paper>
                                        <div className='p-3'>
                                            <div className='reported-by'>
                                                Reported by: {val.rest_name}
                                            </div>
                                            <div className='title'>
                                                Title: {val.report_desc}
                                            </div>
                                            <Alert variant="secondary" className='mt-3'>
                                                <div>
                                                    <Chip
                                                        avatar={<Avatar alt="Natacha" src={avatarImg} />}
                                                        label={val.username}
                                                        color="default"
                                                        variant='contained'
                                                    />
                                                </div>
                                                <div className='mt-2 mb-2'>
                                                    "{val.review_text}"
                                                </div>
                                                <Divider />
                                                <div className='review-sentiment'>
                                                    <Chip style={{ fontSize: '14px' }} label={"Review Sentiment:" + val.review_sentiment} color="info" />
                                                </div>
                                            </Alert>
                                            <div className='mt-2' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button variant='contained' color='warning' onClick={() => { handleShowIgnoreConfirmation(val) }}><FaEyeSlash /></Button>

                                                <Button variant='contained' color='error' style={{ marginLeft: '10px' }} onClick={() => { handleShowDeleteConfirmation(val) }}><FaTrash /></Button>
                                            </div>
                                        </div>
                                    </Paper>
                                </div>
                            </>
                        );
                    })
                }

            </div>

            <Modal show={showDeleteConfirmation} >
                <Modal.Header closeButton onHide={handleCloseDeleteConfirmation}>
                    <Modal.Title>Confirm Delete Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant='danger'>
                        Confirm to delete review reported by {deleteData.rest_name}? By clicking delete, this action cannot be undone.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='contained' color="error" onClick={handleDeleteReport}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showIgnoreConfirmation} >
                <Modal.Header closeButton onHide={handleCloseIgnoreConfirmation}>
                    <Modal.Title>Confirm Ignore Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant='warning'>
                        Confirm to ignore report by {ignoreData.rest_name}? This means that there is nothing wrong with this review and by clicking ignore, the action cannot be undone.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='contained' color="warning" onClick={handleIgnoreReport}>
                        Ignore
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer className="position-fixed p-3" position='bottom-start'>
                <Toast onClose={() => setSuccIgnore(false)} show={succIgnore} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                        <small>now</small>
                    </Toast.Header>
                    <Toast.Body>
                        <Alert variant="success">Review Ignored.</Alert>
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <ToastContainer className="position-fixed p-3" position='bottom-start'>
                <Toast onClose={() => setSuccDelete(false)} show={succDelete} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                        <small>now</small>
                    </Toast.Header>
                    <Toast.Body>
                        <Alert variant="success">Review Successfully Deleted.</Alert>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default AdminReportRequest;