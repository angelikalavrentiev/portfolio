import { useState, useEffect } from "react";

function ProfilPanel({ user, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(user?.title || '');
    const [description, setDescription] = useState(user?.description || '');
    const [CVFile, setCVFile] = useState(null);
    const [CVName, setCVName] = useState("");
    const [photo, setPhoto] = useState(user?.photo || '');

    useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/profil', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCVName(data.CV || '');
        setCVFile(null);
        setPhoto(data.photo || '');
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    fetchProfil();
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (CVFile) formData.append("CV", CVFile);
    if (photo) formData.append("photo", photo);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/profil`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setEditing(false);
      
      const refreshResponse = await fetch('http://localhost:8000/api/profil', {
        method: 'GET'
      });
      const data = await refreshResponse.json();
      
      setTitle(data.title || '');
      setDescription(data.description || '');
      setCVName(data.CV || '');
      setPhoto(data.photo || '');
      
      if (onUpdate) onUpdate();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };


  return (
    <div className="card profil-card">
      <h2>Mon Profil</h2>

      {!editing ? (
        <div className="profil-view">
          <div className="profil-info">
            <div className="info-item">
              <span className="label">Titre:</span>
              <span className="value">{user?.title}</span>
            </div>
            <div className="info-item">
              <span className="label">Description:</span>
              <span className="value">{user?.description}</span>
            </div>
            <div className="info-item">
              <span className="label">CV:</span>
              <span className="value">
                {CVName ? (
                  <a 
                    href={`http://localhost:8000/api/admin/view-cv`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cv-link"
                  >
                    Voir le CV ({CVName})
                  </a>
                ) : 'Aucun CV'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Photo:</span>
              {photo && (
                <div className="photo-preview">
                  <img src={`http://localhost:8000/uploads/photos/${photo}`} alt="photo" />
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setEditing(true)} 
            className="btn btn-primary"
          >
            Modifier
          </button>
        </div>
      ) : (
        <div className="profil-edit">
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Entrez votre titre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea   
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input textarea"
              rows="5"
              placeholder="Entrez votre description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cv">CV (PDF)</label>
            <div className="file-input-wrapper">
              <input
                id="cv"
                type="file"
                accept="application/pdf"
                onChange={(e) => setCVFile(e.target.files[0])}
                className="file-input"
              />
              <span className="file-label">
                {CVFile ? CVFile.name : CVName ? `Actuel: ${CVName}` : 'Choisir un fichier PDF'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo (nom du fichier)</label>
            <input
              id="photo"
              type="text"
              placeholder="exemple.jpg"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="input"
            />
          </div>

          <div className="button-group">
            <button onClick={handleSave} className="btn btn-success">
              Sauvegarder
            </button>
            <button 
              onClick={() => setEditing(false)} 
              className="btn btn-secondary"
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