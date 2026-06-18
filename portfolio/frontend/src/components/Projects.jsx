import { projects } from '../data/portfolio';

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <h2 className="section__title">
          Featured <span>Projects</span>
        </h2>
        <p className="section__subtitle">
          A selection of projects that showcase my skills and experience.
        </p>

        <div className="projects__grid">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <div className="project-card__header">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                </svg>
                <div className="project-card__links">
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repo">
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                      Live
                    </a>
                  )}
                </div>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="project-card__tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
