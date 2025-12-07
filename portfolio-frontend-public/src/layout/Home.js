import Projects from '../pages/Projects';
import Competences from '../components/Competences';
import Profil from '../components/Profil';
import useFetch from '../components/useFetch';

const Home = () => {
    const { data: projects} = useFetch('http://localhost:8000/api/projects');
    const { data: competences } = useFetch('http://localhost:8000/api/competences');
    const { data: profil} = useFetch('http://localhost:8000/api/profil');

    return (  
        <div className="home">
            <h2>Hi</h2>
            {profil && <Profil profil={profil} />}
            {competences && <Competences competences={competences} />}
            {projects && <Projects projects={projects} />}
        </div>
    );
}
 
export default Home;