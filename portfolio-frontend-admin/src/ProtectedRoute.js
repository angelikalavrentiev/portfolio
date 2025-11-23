import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {getMe} from "./apiFetch.js";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getMe();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    }
  };

  if (isAuth === null) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Vérification...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;