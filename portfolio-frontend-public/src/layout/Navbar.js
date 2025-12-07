import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { initDarkMode } from '../assets/js_tailwind/darkmode.js';
import DarkModeToggle from '../components/DarkModeToggle';
import { closeBurgerMenu } from '../assets/js_tailwind/burgermenu.js';
import BurgerMenuToggle from '../components/BurgerMenuToggle';
import '../assets/scss/main.scss';

const Navbar = () => {
    useEffect(() => {
    initDarkMode();
  }, []);

  const handleLinkClick = () => {
        closeBurgerMenu(); 
    };

    return ( 
        <header className="header-container">
            <div className="burger-toggle">
                <BurgerMenuToggle />
            </div> 
        <nav className="navbar">
            <div className="links">
                <Link to="/" onClick={handleLinkClick}>Home</Link>
                <Link to="/about" onClick={handleLinkClick}>About</Link>
                <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
                <Link to="/projects" onClick={handleLinkClick}>Projets</Link>
            </div>
            <div className="menu-options">
                <DarkModeToggle />
            </div>
        </nav>   
        </header>
    );
}
 
export default Navbar;