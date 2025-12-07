import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { closeBurgerMenu } from '../assets/js_tailwind/burgermenu.js';

function BurgerMenuToggle() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
        closeBurgerMenu();
    }, [location.pathname]);

    const handleToggle = () => {

        const newState = !isMenuOpen;
        setIsMenuOpen(newState);

        if (newState) {
            document.documentElement.classList.add('burger');
        } else {
            document.documentElement.classList.remove('burger');
        }
    };

    return (
             <button 
                onClick={handleToggle}
                className="icon-button"
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
            >
                <div className={`icon nav-icon-1 ${isMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
    );
}

export default BurgerMenuToggle;