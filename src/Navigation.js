import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BiFileFind, BiLogIn } from "react-icons/bi";
import Axios from 'axios';
import Avatar from './img/avatar.png';

import './Register';
import './css/Navigation.css';

function Navigation() {
  const [loginStatus, setLoginStatus] = useState("");
  const [loginBool, setLoginBool] = useState(false);
  const [sessionTitle] = useState(<img src={Avatar} alt={loginStatus} style={{ width: '30px', height: '30px', borderRadius: '50%' }}></img>)
  const [userType, setUserType] = useState('');
  const title = <>{sessionTitle}&nbsp;&nbsp;&nbsp;{loginStatus}</>
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login_action").then((res) => {
      if (res.data.loggedIn === true) {
        setLoginBool(true);
        console.log(res);
        setLoginStatus(res.data.user[0].username || res.data.user[0].rest_name);
        setUserType(res.data.userType);
        console.log(userType)
      }
    });
    Axios.get("http://localhost:3001/login_business").then((res) => {
      if (res.data.business_loggedIn === true) {
        setLoginBool(true);
        console.log(res);
        setLoginStatus(res.data.business[0].rest_name);
        setUserType(res.data.userType);
      }
    });
    Axios.get("http://localhost:3001/login_admin").then((res) => {
      if (res.data.loggedIn === true) {
        setLoginBool(true);
        setLoginStatus('Admin');
        setUserType(res.data.userType);
      }
    });
  });

  const logout = () => {
    Axios.post('http://localhost:3001/logout_action', {}).then((res) => {
      if (res.data.success) {
        setLoginBool(false);
        navigate("/Login");
      }
    });
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href='/'><BiFileFind className="BiFileFind" />&nbsp;MAKANAPA</Navbar.Brand>

          <Nav>
            {
              loginBool ?
                userType === 'user' ?
                  <NavDropdown title={title}>
                    <NavDropdown.Item href="/Profile" >Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>
                      Logout
                    </NavDropdown.Item>

                  </NavDropdown> : 
                  
                  <NavDropdown title={title}>
                    <NavDropdown.Item onClick={logout}>
                      Logout
                    </NavDropdown.Item>

                  </NavDropdown>  :
                  <Nav.Link href="/Login"><BiLogIn className="BiLogIn" /></Nav.Link>
            }
          </Nav>

        </Container>
      </Navbar>

    </>
  );
}

export default Navigation;