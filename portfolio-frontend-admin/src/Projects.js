import { useState } from "react";

function ProjectsPanel({ projects, onUpdate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dates, setDates] = useState('');
  const [lienGit, setLienGit] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDates, setEditDates] = useState('');
  const [editLienGit, setEditLienGit] = useState('');

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
        body: JSON.stringify({ title, description, dates, lien_git: lienGit })
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

  const startEdit = (proj) => {
    setEditingId(proj.id);
    setEditTitle(proj.title);
    setEditDescription(proj.description);
    setEditDates(proj.dates);
    setEditLienGit(proj.liengit || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDates('');
    setEditLienGit('');
  };

  const handleUpdate = async (id) => {
    if (!editTitle || !editDescription) {
      alert('Remplissez tous les champs');
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle, 
          description: editDescription, 
          dates: editDates,
          lien_git: editLienGit
        })
      });
      
      cancelEdit();
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
              {editingId === proj.id ? (
              <div style={{ flex: 1 }}>
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input"
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="input"
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    value={editDates}
                    onChange={(e) => setEditDates(e.target.value)}
                    placeholder="dates"
                    className="input"
                  />
                  <input
                    type="text"
                    value={editLienGit}
                    onChange={(e) => setEditLienGit(e.target.value)}
                    placeholder="liengit"
                    className="input"
                  />
                  <div className="button-group" style={{ marginTop: '8px' }}>
                    <button 
                      onClick={() => handleUpdate(proj.id)}
                      className="btn btn-green btn-small"
                    >
                      Sauvegarder
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="btn btn-gray btn-small"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <strong>{proj.title}</strong>
                    <span> - {proj.description}</span>
                    {proj.dates && <p><em>Dates: {proj.dates}</em></p>}
                    {proj.lien_git && ( 
                      <p>
                        <a href={proj.lien_git} target="_blank" rel="noopener noreferrer">
                          Voir sur GitHub : {proj.lien_git}
                        </a>
                      </p>
                    )}
                  </div>
                  <div>
                    <button 
                      onClick={() => startEdit(proj)}
                      className="btn btn-blue btn-small"
                      style={{ marginRight: '8px' }}
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(proj.id)}
                      className="btn btn-red btn-small"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectsPanel;