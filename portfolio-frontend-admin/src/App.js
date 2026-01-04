import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/scss/main.scss';
import NotFound from './pages/404';
import Dashboard from './layout/Dashboard';
import Login from './pages/Login';
import Logout from './components/Logout';
// import Mail from './Mail';
import Navbar from './layout/Navbar';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <div className="App">
            <Navbar />
            <div className="content"> 
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                <Dashboard />
                </ ProtectedRoute>
                } />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              {/* <Route path="/mail" element={<Mail />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </div>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
