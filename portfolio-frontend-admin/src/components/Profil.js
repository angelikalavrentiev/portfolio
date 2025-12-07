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
      await fetch(`http://localhost:8000/api/profil`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      setEditing(false);
      const response = await fetch('http://localhost:8000/api/profil', {
        method: 'GET',
        credentials: 'include'
    }); 
    const data = await response.json();
      
      setTitle(data.title || '');
      setDescription(data.description || '');
      setCVName(data.cv || '');
      setPhoto(data.photo || '');
      
      if (onUpdate) onUpdate();
      }catch (error) {
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
            <p><strong>CV:</strong> {CVName ? (
            <a 
              href={`http://localhost:8000/api/admin/view-cv`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Voir le CV ({CVName})
            </a>
          ) : 'Aucun CV'}</p>  
            <p><strong>Photo:</strong></p>
            {photo && <img src={`http://localhost:8000/uploads/photos/${photo}`} alt="photo" />}

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
            onChange={(e) => setCVFile(e.target.files[0])}
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