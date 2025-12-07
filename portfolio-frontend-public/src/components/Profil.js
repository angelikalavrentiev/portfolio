
const Profil = ({profil}) => {

    return ( 
        <div className="profil">
                <div className="profil" key={profil.id}>
                    <h2>{profil.title}</h2>
                    <p>{profil.description}</p>
                </div>
        </div>
     );
}
 
export default Profil;