import Login from './Login';
import { Routes, Route } from 'react-router-dom';
import Register from './Register';
import Home from './Home';
import Navigation from './Navigation';
import EateryDetail from './EateryDetail';
import Profile from './Profile';
import Business from './Business/Business_Layout/Business';
import RegisterBusiness from './RegisterBusiness';
import LoginBusiness from './LoginBusiness';
import LoginAdmin from './LoginAdmin';
import Admin from './Admin/Admin';
import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LoginBusiness" element={<LoginBusiness />} />
        <Route path="/LoginAdmin" element={<LoginAdmin />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/RegisterBusiness" element={<RegisterBusiness />} />
        <Route path="/Detailed/:id" element={<EateryDetail />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Business" element={<Business />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
