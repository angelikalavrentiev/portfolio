import { useState } from "react";

function ProjectsPanel({ projects, onUpdate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dates, setDates] = useState('');
  const [lienGit, setLienGit] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Remplissez tous les champs');
      return;
    }

    try {
      await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dates, lienGit })
      });

      setTitle('');
      setDescription('');
      setDates('');
      setLienGit('')
      onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;

    try {
      await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  return (
    <div className="card">
      <h2> Mes Projets ({projects.length})</h2>

      <form onSubmit={handleAdd} className="form">
        <input
          type="text"
          placeholder="Titre du projet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input textarea"
          rows="3"
        />

        <input
          type="text"
          placeholder="dates"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="liengit"
          value={lienGit}
          onChange={(e) => setLienGit(e.target.value)}
          className="input"
        />

        <button type="submit" className="btn btn-green">
           Ajouter
        </button>
      </form>

      <div className="list">
        {projects.length === 0 ? (
          <p className="empty">Aucun projet ajouté</p>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className="item">
              <div>
                <strong>{proj.title}</strong>
                <p className="description">{proj.description}</p>
                <span className="badge">{proj.dates}</span>
              </div>
              <button 
                onClick={() => handleDelete(proj.id)}
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

export default ProjectsPanel;