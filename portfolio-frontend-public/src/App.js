import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/scss/main.scss';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import Home from './layout/Home';
import About from './pages/About';
import Projects from './pages/Galaxy';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import NotFound from './pages/404';
import useFetch from './components/useFetch';

function App() {
  const { data: projects } = useFetch('http://localhost:8000/api/projects');

  return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects projects={projects} />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    );
}

export default App;
