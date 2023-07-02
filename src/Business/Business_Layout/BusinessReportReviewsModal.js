import { useState } from 'react';
import Axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AlertTitle from '@mui/material/AlertTitle';

function BusinessReportReviewsModal({ handleShowModalState, showModal, reviewToDelete, businessId }) {
    const [showReportDesc, setShowReportDesc] = useState(false);
    const [showReportTitle, setShowReportTitle] = useState(false);
    const [radioReviewDesc, setRadioReviewDesc] = useState('');
    const [showReportSucc, setShowReportSucc] = useState(false);

    const handleClose = () => {
        setShowReportDesc(false);
        setShowReportTitle(false);
        setShowReportSucc(false);
        setRadioReviewDesc('');
        handleShowModalState(!showModal);
    };

    const onClickYesBtn = () => {
        setShowReportDesc(!showReportDesc);
        setShowReportTitle(!showReportTitle);
    }

    const submitReviewReport = () => {
        Axios.post('http://localhost:3001/business_submit_review_report', {
            review_desc: radioReviewDesc,
            reviewToDelete: reviewToDelete,
            businessId: businessId
        }).then((res) => {
            console.log(res)
        });
        setShowReportDesc(!showReportDesc);
        setShowReportSucc(!showReportSucc);
    }


    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert severity="warning" hidden={showReportTitle}>
                        Are you sure you want to report this review?
                    </Alert>

                    <div hidden={!showReportDesc}>
                        <FormControl style={{ marginLeft: '5px' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Tell us more about it:</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                onChange={(e, val) => { setRadioReviewDesc(val); }}
                                className='mt-2'
                            >
                                <FormControlLabel value="Unwanted Content or Spam" control={<Radio />} label="Unwanted content or spam" />
                                <FormControlLabel value="Hate Speech or Violence" control={<Radio />} label="Hate Speech or violence" />
                                <FormControlLabel value="Harrassment or Bullying" control={<Radio />} label="Harrassment or bullying" />
                                <FormControlLabel value="Irrelevant to the discussion or incorrect" control={<Radio />} label="Irrelevant to the discussion or incorrect" />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <div hidden={!showReportSucc}>
                        <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
                            Review reported. Please allow admin to review this post before taking it down.
                        </Alert>
                    </div>
                </Modal.Body>
                <Modal.Footer hidden={showReportSucc}>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>

                    {!showReportDesc ? <Button variant="danger" onClick={ onClickYesBtn }>
                        Yes
                    </Button> : <Button variant="success" onClick={submitReviewReport}>
                        Submit
                    </Button>}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BusinessReportReviewsModal;