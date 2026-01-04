import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();

    if (location.pathname === "/contact") {
        return null;
    }

    return ( 
        <nav className="footer">
            <div className="links">
                <h2>Looking for internship</h2>
                <Link to="/contact">Contact</Link>
                <a href="https://github.com/angelikalavrentiev">GitHub</a>
                <Link to="/about">CV</Link>
            </div>
        </nav>    
    );
}
 
export default Footer;