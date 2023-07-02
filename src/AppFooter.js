import './css/AppFooter.css';
import { SiFacebook } from "react-icons/si";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

function AppFooter() {
    return (
        <>
            <div className="parent-footer">
                <div className="connect">
                    <h5>Connect socially with MakanApa.</h5>
                </div>
                <div className="socials">
                    <a className="footer-a" href="https://www.facebook.com/"><SiFacebook className="facebook" /></a>
                    <a className="footer-a" href="https://www.instagram.com/"><RiInstagramFill className="instagram" /></a>
                    <a className="footer-a" href="https://twitter.com/"><AiFillTwitterCircle className="twitter" /></a>
                    <a className="footer-a" href="https://www.tiktok.com/foryou?is_copy_url=1&is_from_webapp=v1"><FaTiktok className="tiktok" /></a>
                </div>
                <div className="copyright">
                    <p>© 2023 MakanApa MY All rights reserved.</p>
                </div>
            </div>
        </>
    );
}

export default AppFooter;