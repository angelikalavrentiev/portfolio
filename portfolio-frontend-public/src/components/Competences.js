const Competences = ({ competences = [] }) => {
  const list = Array.isArray(competences)
    ? competences
    : competences && competences['hydra:member']
    ? competences['hydra:member']
    : Object.values(competences || {});
  const filtered = list.filter((c) => c && (c.category || c.category === ""));
  const grouped = filtered.reduce((acc, comp) => {
    const cat = comp.category || "";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(comp);
    return acc;
  }, {});

  return (
    <section className="competences">
      {Object.entries(grouped).map(([category, comps]) => (
        <div className="category" key={category}>
          <h3>{category}</h3>

          <div className="category-content">
            {comps.map((comp, idx) => (
              <div className="comp" key={comp?.id ?? idx}>
                <img
                  src={comp?.image ? `http://localhost:8000${comp.image}` : ''}
                  alt={comp?.name || ''}
                  loading="lazy"
                />
                <p>{(comp?.name || "").toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Competences;
