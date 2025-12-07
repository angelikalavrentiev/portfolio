import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/404';
import Dashboard from './layout/Dashboard';
import Login from './pages/Login';
import Logout from './components/Logout';
// import Mail from './Mail';
import Navbar from './layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
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
            {/* <Route path="/profile" element={<ProfileUpdate />} />
            <Route path="/projects/:id" element={<ProjectUpdate />} />
            <Route path="/competences/:id" element={<CompetenceUpdate />} />
            <Route path="/mail" element={<Mail />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
