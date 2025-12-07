import { useState, useEffect } from 'react';
import { toggleDarkMode, isDarkMode } from '../assets/js_tailwind/darkmode.js';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
  }, []);

  const handleToggle = () => {
    toggleDarkMode();
    setIsDark(!isDark);
  };

  return (
    <button 
      onClick={handleToggle}
      className="btn-toggle"
      aria-label="Toggle dark mode"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

export default DarkModeToggle;