import { useState } from 'react';

export default function CVButton() {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                className="btn btn-primary"
                onClick={() => setShowMenu(!showMenu)}
            >
                Mon CV ▾
            </button>
            
            {showMenu && (
                <div 
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '0.5rem',
                        backgroundColor: 'rgba(10, 31, 68, 0.95)',
                        border: '2px solid rgba(0, 212, 255, 0.5)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        minWidth: '200px',
                        zIndex: 1000,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <a 
                        href="http://localhost:8000/api/admin/view-cv" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            display: 'block',
                            padding: '0.5rem 1rem',
                            color: '#00d4ff',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        Voir le CV
                    </a>
                    <a 
                        href="http://localhost:8000/api/admin/download-cv" 
                        download
                        style={{
                            display: 'block',
                            padding: '0.5rem 1rem',
                            color: '#00d4ff',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        Télécharger le CV
                    </a>
                </div>
            )}
            
            {showMenu && (
                <div 
                    onClick={() => setShowMenu(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
}
