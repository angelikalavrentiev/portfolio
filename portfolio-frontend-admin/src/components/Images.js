import { useState } from "react";
import { apiFetch } from "../components/apiFetch";

function ImagesPanel({ images, projects, onUpdate }) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [projectId, setProjectId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editSrc, setEditSrc] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editProjectId, setEditProjectId] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!src || !alt || !projectId) {
      alert("Remplissez tous les champs");
      return;
    }

    try {
      await apiFetch("/api/images", {
        method: "POST",
        body: JSON.stringify({
          src,
          alt,
          projectId: Number(projectId),
        }),
      });

      setSrc("");
      setAlt("");
      setProjectId("");
      onUpdate();
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  const startEdit = (img) => {
    setEditingId(img.id);
    setEditSrc(img.src);
    setEditAlt(img.alt);
    setEditProjectId(img.projectId || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSrc("");
    setEditAlt("");
    setEditProjectId("");
  };

  const handleUpdate = async (id) => {
    if (!editSrc || !editAlt || !editProjectId) {
      alert("Remplissez tous les champs");
      return;
    }

    try {
      await apiFetch(`/api/images/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          src: editSrc,
          alt: editAlt,
          projectId: Number(editProjectId),
        }),
      });

      cancelEdit();
      onUpdate();
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette image ?")) return;

    try {
      await apiFetch(`/api/images/${id}`, {
        method: "DELETE",
      });

      onUpdate();
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  const getProjectName = (id) => {
    const proj = projects.find((p) => p.id === id);
    return proj ? proj.title : "Projet inconnu";
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="card">
      <h2>Images des projets ({images.length})</h2>

      {/* ===== ADD FORM ===== */}
      <form onSubmit={handleAdd} className="form">
        <input
          type="text"
          placeholder="Source image"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="Texte alternatif"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="input"
        />

        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="input"
        >
          <option value="">-- Sélectionner un projet --</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-green">
          Ajouter
        </button>
      </form>

      {/* ===== LIST ===== */}
      <div className="list">
        {images.length === 0 ? (
          <p className="empty">Aucune image ajoutée</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className="item">
              {editingId === img.id ? (
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={editSrc}
                    onChange={(e) => setEditSrc(e.target.value)}
                    className="input"
                    style={{ marginBottom: "8px" }}
                  />

                  <input
                    type="text"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    className="input"
                    style={{ marginBottom: "8px" }}
                  />

                  <select
                    value={editProjectId}
                    onChange={(e) => setEditProjectId(e.target.value)}
                    className="input"
                  >
                    <option value="">-- Sélectionner un projet --</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>

                  <div className="button-group" style={{ marginTop: "8px" }}>
                    <button
                      onClick={() => handleUpdate(img.id)}
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
                    <strong>{img.src}</strong>
                    <span> — {img.alt}</span>
                    <p>
                      Projet : <em>{getProjectName(img.projectId)}</em>
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => startEdit(img)}
                      className="btn btn-blue btn-small"
                      style={{ marginRight: "8px" }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
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

export default ImagesPanel;
