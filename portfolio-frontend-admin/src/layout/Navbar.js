import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Navbar = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="links">
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
