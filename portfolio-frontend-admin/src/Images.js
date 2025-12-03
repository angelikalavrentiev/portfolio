import { useState } from "react";

function ImagesPanel({ images, projects, onUpdate }) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!src || !alt || !projectId) {
      alert('Remplissez tous les champs');
      return;
    }

    try {
      await fetch('http://localhost:8000/api/images', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src, alt, projectId })
      });

      setSrc('');
      setAlt('');
      setProjectId('');
      onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return;

    try {
      await fetch(`http://localhost:8000/api/images/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const getProjectName = (id) => {
    const proj = projects.find(p => p.id === id);
    return proj ? proj.title : "Projet inconnu";
  };
  
  return (
    <div className="card">
      <h2> Images des projets ({images.length})</h2>

      <form onSubmit={handleAdd} className="form">
        <input
          type="text"
          placeholder="src image"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="alt image"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="input"
        />

        <select
          value={projectId}
          onChange={(e) => setProjectId(parseInt(e.target.value))}
          className="input"
        >
          <option value="">-- Sélectionner un projet --</option>

          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-green">
           Ajouter
        </button>
      </form>

      <div className="list">
        {images.length === 0 ? (
          <p className="empty">Aucune images ajouté</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className="item">
              <div>
                <strong>{img.alt}</strong>
                <p>{img.src}</p>
                <span>Projet : {getProjectName(img.projectId)}</span>
              </div>
              <button 
                onClick={() => handleDelete(img.id)}
                className="btn btn-red btn-small"
              >
                    Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ImagesPanel;