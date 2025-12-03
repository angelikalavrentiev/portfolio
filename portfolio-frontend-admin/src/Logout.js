import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './apiFetch';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logout();
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            } finally {
                navigate('/login');
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="logout-page">
            <h2>Déconnexion en cours...</h2>
        </div>
    );
}

export default Logout;
