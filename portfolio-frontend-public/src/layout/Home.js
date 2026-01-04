import Galaxy from '../pages/Galaxy';
import Competences from '../components/Competences';
import Profil from '../components/Profil'; 
import useFetch from '../components/useFetch';

const Home = () => {
    const { data: projects} = useFetch('http://localhost:8000/api/projects');
    const { data: competences } = useFetch('http://localhost:8000/api/competences');
    const { data: profil} = useFetch('http://localhost:8000/api/profil');

    return (  
        <div className="home">
            <section className="hero-section">
                {profil && <Profil profil={profil} />}
            </section>
            {competences && <Competences competences={competences} />}
            {projects && <Galaxy projects={projects} />}
        </div>
    );
}
 
export default Home;