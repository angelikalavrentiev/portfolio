import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './404';
import Dashboard from './Dashboard';
import Login from './Login';
// import ProfileUpdate from './ProfileUpdate';
// import ProjectUpdate from './ProjectUpdate';
// import CompetenceUpdate from './CompetenceUpdate';
// import Mail from './Mail';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';

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
