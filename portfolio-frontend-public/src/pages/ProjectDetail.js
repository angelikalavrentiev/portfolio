import { useParams } from 'react-router-dom';
import useFetch from '../components/useFetch';

const ProjectDetail = () => {
    const { id } = useParams();
    const { data: project, isPending, error } = useFetch('http://localhost:8000/api/projects/' + id);   
    return ( 
        <div className="project-details">
            <h2>Project Detail Page</h2>
            { isPending && <div>Loading...</div> }
            { error && <div>{error}</div> }
            { project && (
                <article>
                    <h2>{ project.title }</h2>
                    <div>{ project.description }</div>
                    <div>
                    {project.competences.map(c => (
                        <span key={c.id}>{c.name}</span>
                    ))}
                    </div>
                </article>
            ) }
        </div>
     );
}
 
export default ProjectDetail;