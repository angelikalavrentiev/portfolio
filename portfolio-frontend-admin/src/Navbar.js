import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <div className="links">
                <Link to="/">Dashboard</Link>
                <Link to="/logout">Logout</Link>
            </div>
        </nav>    
    );
}
 
export default Navbar;