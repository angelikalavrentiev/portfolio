import Projects from './Projects';
import Competences from './Competences';
import useFetch from './useFetch';

const Home = () => {
    const { data: projects} = useFetch('http://localhost:8000/api/projects');
    const { data: competences } = useFetch('http://localhost:8000/api/competences');

    return (  
        <div className="home">
            <h2>Hi</h2>
            {competences && <Competences competences={competences} />}
            {projects && <Projects projects={projects} />}
        </div>
    );
}
 
export default Home;