import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CV from '../components/CV';

const Footer = () => {
    const location = useLocation();

    if (location.pathname === "/contact") {
        return null;
    }

    return ( 
        <nav className="footer">
            <div className="links">
                <h2>Recherche de stage et alternance</h2>
                <Link to="/contact">Contact</Link>
                <a href="https://github.com/angelikalavrentiev">GitHub</a>
                <CV />
            </div>
        </nav>    
    );
}
 
export default Footer;