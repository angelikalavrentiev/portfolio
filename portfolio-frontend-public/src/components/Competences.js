const Competences = ({ competences }) => {
  const grouped = competences.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {});

  return (
    <div className="competences">
      {Object.entries(grouped).map(([category, comps]) => (
        <div className="category" key={category}>
          <h3>{category}</h3>

          <div className="category-content">
            {comps.map((comp) => (
              <div className="comp" key={comp.id}>
                {comp.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Competences;
