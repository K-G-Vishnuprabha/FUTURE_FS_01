import { profile, skills } from '../data/portfolio';

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section__title">
          About <span>Me</span>
        </h2>
        <div className="about__grid">
          <div className="about__text">
            <p>{profile.summary}</p>
            <ul className="about__info">
              <li>
                <strong>Name:</strong> {profile.name}
              </li>
              <li>
                <strong>Location:</strong> {profile.location}
              </li>
              <li>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <strong>Role:</strong> {profile.title}
              </li>
            </ul>
          </div>
          <div className="about__skills-preview">
            <h3>Core Skills</h3>
            <div className="skills-grid">
              {skills.slice(0, 6).map((skill) => (
                <div key={skill.name} className="skill-item">
                  <div className="skill-item__header">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="skill-item__bar">
                    <div className="skill-item__fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
