import { useState } from "react";

function CompetencesPanel({ competences, onUpdate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

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
        body: JSON.stringify({ name, category })
      });
      
      setName('');
      setCategory('');
      setImage('');
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
              <div>
                <strong>{comp.name}</strong>
                <span >{comp.category}</span>
              </div>
              <button 
                onClick={() => handleDelete(comp.id)}
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

export default CompetencesPanel;