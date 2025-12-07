import { useState } from "react";

function CompetencesPanel({ competences, onUpdate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editImage, setEditImage] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!name || !category) {
      alert('Remplissez tous les champs');
      return;
    }

    try {
      await fetch('http://localhost:8000/api/competences', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, image })
      });
      
      setName('');
      setCategory('');
      setImage('');
      onUpdate(); 
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const startEdit = (comp) => {
    setEditingId(comp.id);
    setEditName(comp.name);
    setEditCategory(comp.category);
    setEditImage(comp.image || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCategory('');
    setEditImage('');
  };

  const handleUpdate = async (id) => {
    if (!editName || !editCategory) {
      alert('Remplissez tous les champs');
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/competences/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName, 
          category: editCategory, 
          image: editImage 
        })
      });
      
      cancelEdit();
      onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette compétence ?')) return;

    try {
      await fetch(`http://localhost:8000/api/competences/${id}`, {
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
      <h2> Mes Compétences ({competences.length})</h2>

      <form onSubmit={handleAdd} className="form">
        <input
          type="text"
          placeholder="nom compétence"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        >
          <option value="">-- Choisir une catégorie --</option>
          <option value="front">Front</option>
          <option value="back">Back</option>
          <option value="other">Autres</option>
        </select>
        <input
          type="text"
          placeholder="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="input"
        />

        <button type="submit" className="btn btn-green">
           Ajouter
        </button>
      </form>

      <div className="list">
        {competences.length === 0 ? (
          <p className="empty">Aucune compétence ajoutée</p>
        ) : (
          competences.map((comp) => (
            <div key={comp.id} className="item">
              {editingId === comp.id ? (
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input"
                    style={{ marginBottom: '8px' }}
                  />
                  <select 
                    value={editCategory} 
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="input"
                    style={{ marginBottom: '8px' }}
                  >
                    <option value="">-- Choisir une catégorie --</option>
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                    <option value="other">Autres</option>
                  </select>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="image"
                    className="input"
                  />
                  <div className="button-group" style={{ marginTop: '8px' }}>
                    <button 
                      onClick={() => handleUpdate(comp.id)}
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
                    <strong>{comp.name}</strong>
                    <span> - {comp.category}</span>
                    {comp.image && <p>{comp.image}</p>}
                  </div>
                  <div>
                    <button 
                      onClick={() => startEdit(comp)}
                      className="btn btn-blue btn-small"
                      style={{ marginRight: '8px' }}
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(comp.id)}
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

export default CompetencesPanel;