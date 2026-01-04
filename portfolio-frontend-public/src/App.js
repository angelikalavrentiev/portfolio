import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import "./assets/scss/main.scss";

import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Home from "./layout/Home";
import About from "./pages/About";
import Projects from "./pages/Galaxy";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/404";

import useFetch from "./components/useFetch";
import Scene from "./components/Scene";
import Loader from "./components/Loader";

function AppContent() {
  const location = useLocation();
  const { data: projects, loading: projectsLoading, fromCache: projectsFromCache } = useFetch(
    "http://localhost:8000/api/projects"
  );
  const { data: competences, loading: competencesLoading, fromCache: competencesFromCache } = useFetch(
    "http://localhost:8000/api/competences"
  );
  const { data: profil, loading: profilLoading, fromCache: profilFromCache } = useFetch(
    "http://localhost:8000/api/profil"
  );
  const [sceneReady, setSceneReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const anyLoading = projectsLoading || competencesLoading || profilLoading;
  const anyFromCache = projectsFromCache || competencesFromCache || profilFromCache;
  const readyToCheckImages = sceneReady && !anyLoading && !anyFromCache;

  // Reset loading states when navigating to home
  useEffect(() => {
    if (location.pathname === '/') {
      setSceneReady(false);
      setImagesLoaded(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!readyToCheckImages || !projects) return;
    const content = document.querySelector(".content");
    if (!content) {
      setImagesLoaded(true);
      return;
    }
    const imgs = Array.from(content.querySelectorAll("img"));
    if (imgs.length === 0) {
      setImagesLoaded(true);
      return;
    }
    let remaining = imgs.length;
    const onLoad = () => {
      remaining -= 1;
      if (remaining <= 0) setImagesLoaded(true);
    };
    const handlers = [];
    imgs.forEach((img) => {
      if (img.complete) {
        remaining -= 1;
      } else {
        const l = () => onLoad();
        const e = () => onLoad();
        img.addEventListener("load", l);
        img.addEventListener("error", e);
        handlers.push([img, l, e]);
      }
    });
    if (remaining <= 0) {
      setImagesLoaded(true);
      return () => {};
    }
    const timeout = setTimeout(() => setImagesLoaded(true), 8000);
    return () => {
      clearTimeout(timeout);
      handlers.forEach(([img, l, e]) => {
        img.removeEventListener("load", l);
        img.removeEventListener("error", e);
      });
    };
  }, [readyToCheckImages, projects]);

  const appReady = location.pathname === '/' ? (readyToCheckImages && imagesLoaded) : true;

  useEffect(() => {
    document.body.style.overflow = appReady ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [appReady]);

  return (
    <>
      {!appReady && <Loader />}
      <Scene onReady={() => setSceneReady(true)} />
      <div className="App">
        <Navbar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/projects"
              element={<Projects projects={projects} />}
            />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
