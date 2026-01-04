import { useEffect, useState } from "react";
import { getMe, getProjects, getCompetences, getImages } from '../components/apiFetch.js';
import ProfilPanel from '../components/Profil.js';
import ProjectsPanel from '../components/Projects.js';
import CompetencesPanel from '../components/Competences.js';
import ImagesPanel from '../components/Images.js';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);
const loadAllData = async () => {
    try {
        const userData = await getMe();
      setUser(userData);

      const projectsData = await getProjects();
      setProjects(projectsData || []);

      const competencesData = await getCompetences();
      setCompetences(competencesData || []);

      const imagesData = await getImages();
      setImages(imagesData || []);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur au chargement des données');
    } finally {
      setLoading(false); 
    }
  };
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Admin</h1>
      <div className="header">
        <h1> Mon Dashboard</h1>
        <p>Bienvenue {user?.email}</p>
      </div>

      <div className="container">

        <ProfilPanel user={user} onUpdate={loadAllData} />

        <CompetencesPanel 
          competences={competences} 
          onUpdate={loadAllData} 
        />

        <ProjectsPanel 
          projects={projects} 
          onUpdate={loadAllData} 
        />

        <ImagesPanel 
          images={images} 
          projects={projects}
          onUpdate={loadAllData} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
