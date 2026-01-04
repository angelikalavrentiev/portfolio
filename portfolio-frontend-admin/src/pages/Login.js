import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../components/apiFetch.js"; 
import { useAuth } from "../components/AuthContext.js"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser, checkAuth } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await apiLogin(email, password);
      
      if (result.success) {
        await checkAuth();
        navigate("/", { replace: true });
      } else {
        setError(result.error || "Erreur de connexion");
      }
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>Connexion Admin</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="login-input"
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;