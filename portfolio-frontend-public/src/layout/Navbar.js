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
        <nav className="navbar menu-hero">
            <div className="menu-blob"></div>

            <div className="menu-header">
                <div className="menu-brand">
                    <span className="brand-name">portfolio / 2026</span>
                </div>
                <div className="menu-actions">
                    <DarkModeToggle />
                </div>
            </div>

            <div className="menu-list">
                <div className="menu-item">
                    <span className="menu-index">01</span>
                    <Link to="/" onClick={handleLinkClick}>ACCUEIL</Link>
                </div>
                <div className="menu-item">
                    <span className="menu-index">02</span>
                    <Link to="/about" onClick={handleLinkClick}>A PROPOS</Link>
                </div>
                <div className="menu-item">
                    <span className="menu-index">03</span>
                    <Link to="/contact" onClick={handleLinkClick}>CONTACT</Link>
                </div>
            </div>

            <div className="menu-social">
                <a href="#" aria-label="GitHub">↗ GitHub</a>
            </div>
        </nav>   
        </header>
    );
}
 
export default Navbar;