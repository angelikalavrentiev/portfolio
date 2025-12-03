import { useState } from "react";

function ProfilPanel({ user, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(user?.title || '');
    const [description, setDescription] = useState(user?.description || '');
    const [CV, setCV] = useState(user?.CV || '');
    const [photo, setPhoto] = useState(user?.photo || '');
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (CV) formData.append("cv", CV);      
    if (photo) formData.append("photo", photo);
    try {
      await fetch(`http://localhost:8000/api/profil/${user.id}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      setEditing(false);
      onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  return (
    <div className="card">
      <h2> Mon Profil</h2>

      {!editing ? (
        <div>
          <p><strong>Titre:</strong> {user?.title}</p>
          <p><strong>Description:</strong> {user?.description}</p>
            <p><strong>CV:</strong> {user?.CV}</p>  
            <p><strong>Photo:</strong> {user?.photo}</p>
          <button 
            onClick={() => setEditing(true)} 
            className="btn btn-blue"
          >
             Modifier
          </button>
        </div>
      ) : (
        <div>
          <input
            type="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
            <textarea   
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input textarea"
            rows="3"
            />
            <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCV(e.target.files[0])}
            className="input"
            />
            <input
            type="text"
            placeholder="image"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="input"
            />
          <div className="button-group">
            <button onClick={handleSave} className="btn btn-green">
               Sauvegarder
            </button>
            <button 
              onClick={() => setEditing(false)} 
              className="btn btn-gray"
            >
               Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilPanel;