// Component
import AppFooter from '../AppFooter';
import './css/Admin.css';
import AdminDashboard from './AdminDashboard';
import AdminBusinessApproval from './AdminBusinessApproval';
import AdminReportRequest from './AdminReportRequest';
// Bootstrap
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

function Admin() {
    return (
        <>
            <div className='parent-admin-home'>
                <div className='parent-tab-admin'>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="dashboard">
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="dashboard" className='p-25 c-black'>Dashboard</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="app-business-acc" className='p-25 c-black'>Business Account Requests</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="report-req" className='p-25 c-black'>Report Requests</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="dashboard">
                                        <AdminDashboard />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="app-business-acc">
                                        <AdminBusinessApproval />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="report-req">
                                        <AdminReportRequest />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </div>

            <AppFooter />
        </>
    );
}

export default Admin;