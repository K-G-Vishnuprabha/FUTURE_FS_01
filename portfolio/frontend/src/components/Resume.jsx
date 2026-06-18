import { useState } from 'react';
import { experience, education, skills } from '../data/portfolio';

const tabs = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
];

export default function Resume() {
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="resume" className="section resume">
      <div className="container">
        <h2 className="section__title">
          My <span>Resume</span>
        </h2>

        <div className="resume__tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`resume__tab ${activeTab === tab.id ? 'resume__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="resume__content">
          {activeTab === 'experience' && (
            <div className="timeline" role="tabpanel">
              {experience.map((item) => (
                <article key={item.role} className="timeline__item">
                  <div className="timeline__dot" />
                  <div className="timeline__card">
                    <span className="timeline__period">{item.period}</span>
                    <h3>{item.role}</h3>
                    <p className="timeline__company">{item.company}</p>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="timeline" role="tabpanel">
              {education.map((item) => (
                <article key={item.degree} className="timeline__item">
                  <div className="timeline__dot" />
                  <div className="timeline__card">
                    <span className="timeline__period">{item.period}</span>
                    <h3>{item.degree}</h3>
                    <p className="timeline__company">{item.institution}</p>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-grid skills-grid--full" role="tabpanel">
              {skills.map((skill) => (
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
          )}
        </div>
      </div>
    </section>
  );
}
