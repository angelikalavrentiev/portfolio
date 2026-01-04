import CV from './CV';

const Profil = ({profil}) => {
    const nameParts = profil.title ? profil.title.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return ( 
        <div className="profil">
            <div className="profil-container">
                <div className="profil-name">
                    <h1>
                        <span className="first-name">{firstName}</span>
                        <span className="last-name">{lastName}</span>
                    </h1>
                </div>
                
                <div className="profil-content">
                    <p className="description">{profil.description}</p>
                    <div className="profil-actions">
                        <CV />
                        <a href="/contact" className="btn btn-secondary">Contactez-moi</a>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Profil;