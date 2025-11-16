import { Link } from 'react-router-dom';

const Projects = ({projects}) => {
    
    return ( 
        <div className="projects">
            {projects && (
             projects.map((project) => (
                <div className="project-preview" key={project.id}>
                    <Link to={`/projects/${project.id}`} >
                    <h2>{project.title}</h2>
                    </Link>
                    <div>
                    {project.competences && project.competences.map(c => (
                        <span key={c.id}>{c.name}</span>
                    ))}
                    </div>
                </div>
            )))}
        </div>
     );
}
 
export default Projects;