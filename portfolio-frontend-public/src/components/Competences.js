
const Competences = ({competences}) => {

    return ( 
        <div className="competences">
            {competences && competences.map((competence) => (
                <div className="competences" key={competence.id}>
                    <h2>{competence.name}</h2>
                </div>
            ))}
        </div>
     );
}
 
export default Competences;