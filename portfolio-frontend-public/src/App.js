import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import ProjectDetail from './ProjectDetail';
import Contact from './Contact';
import NotFound from './404';
import useFetch from './useFetch';

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
