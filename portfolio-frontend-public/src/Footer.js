import { Link } from "react-router-dom";

const Footer = () => {
    return ( 
        <nav className="looter">
            <div className="links">
                <h2>Looking for intership</h2>
                <Link to="/contact">Contact</Link>
                <Link to="/">GitHub</Link>
                <Link to="/about">CV</Link>
            </div>
        </nav>    
    );
}
 
export default Footer;