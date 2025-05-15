import { useRef, useState, useCallback, Suspense, lazy } from 'react';
import React from 'react';
import { Footer } from '~/components/footer';
import { Section } from '~/components/section';
import { DecoderText } from '~/components/decoder-text';
import { Transition } from '~/components/transition';
import { useInViewport } from '~/hooks';
import { cssProps } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './experience.module.css';

const ExperienceBackground = lazy(() => import('./experience-background').then(
  module => ({ default: module.ExperienceBackground })
));

export const meta = () => {
  return baseMeta({
    title: 'Experience',
    description: 'Professional work experience and skills in design and development.',
  });
};

// Experience data
const jobs = [
  {
    id: 1,
    title: 'Specialist Leader',
    company: 'Deloitte Digital',
    timeframe: 'May 2021 - Present',
    description: 'Leading AI/ML-driven digital transformation using AEM and Adobe LiveCycle. Delivered scalable RESTful web services and AI Ops solutions across enterprise clients.',
    tech: ['Machine Learning', 'AI Ops', 'Artificial Intelligence (AI)', 'Adobe Experience Manager (AEM)', 'Adobe LiveCycle', 'RESTful WebServices', 'Python']
  },
  {
    id: 2,
    title: 'Specialist Master',
    company: 'Deloitte Digital',
    timeframe: 'Mar 2018 - May 2021',
    description: 'Architected AEM-based digital platforms, automated workflows with Adobe LiveCycle, and developed APIs in Python for federal and commercial clients.',
    tech: ['Machine Learning', 'Adobe Experience Manager (AEM)', 'Adobe LiveCycle', 'RESTful WebServices', 'Python']
  },
  {
    id: 3,
    title: 'Software Consultant',
    company: 'R3 Technologies, Inc.',
    timeframe: '2004 - Mar 2018',
    description: 'Delivered robust AEM and LiveCycle implementations. Designed and optimized RESTful services supporting enterprise-scale applications.',
    tech: ['Machine Learning', 'Adobe Experience Manager (AEM)', 'Adobe LiveCycle', 'RESTful WebServices', 'Python']
  },
  {
    id: 4,
    title: 'Lead AEM Developer / Technical Account Manager',
    company: 'Adobe',
    timeframe: 'May 2017 - Oct 2017',
    description: 'Provided AEM consultation to major clients, guided LiveCycle forms development, and improved performance of web services.',
    tech: ['Adobe Experience Manager (AEM)', 'Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 5,
    title: 'Sr. AEM Forms Developer / Solutions Architect',
    company: 'Florida Department of Environmental Protection',
    timeframe: 'Jun 2015 - May 2017',
    description: 'Architected AEM Forms solutions and automated state forms processing with Adobe LiveCycle and REST APIs.',
    tech: ['Adobe Experience Manager (AEM)', 'Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 6,
    title: 'Sr. Adobe LiveCycle Consultant',
    company: 'Deloitte',
    timeframe: 'Aug 2014 - May 2015',
    description: 'Engineered complex Adobe LiveCycle workflows and backend RESTful integrations for public sector clients.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 7,
    title: 'Adobe LiveCycle SME',
    company: 'Motorola Solutions',
    timeframe: '2015',
    description: 'Subject matter expert for Adobe LiveCycle forms and services. Delivered training and optimized form-based solutions.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 8,
    title: 'Adobe LiveCycle Consultant',
    company: 'CIT / Genesys10',
    timeframe: 'Jan 2014 - Jul 2014',
    description: 'Designed and implemented enterprise LiveCycle solutions and RESTful services integration.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 9,
    title: 'Sr. Adobe LiveCycle Consultant',
    company: 'Principal Financial Group',
    timeframe: '2014',
    description: 'Developed secure digital document workflows using Adobe LiveCycle and backend service integration.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 10,
    title: 'Adobe LiveCycle Consultant',
    company: 'CGI',
    timeframe: 'Jun 2012 - Dec 2013',
    description: 'Led the Adobe LiveCycle forms implementation for government services with RESTful integration.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 11,
    title: 'Adobe LiveCycle Consultant',
    company: 'Mesirow Financial',
    timeframe: 'Feb 2012 - Jun 2012',
    description: 'Implemented LiveCycle forms automation and optimized REST-based integration layers.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 12,
    title: 'Adobe LiveCycle Consultant',
    company: 'Deloitte Consulting',
    timeframe: 'Jul 2011 - Mar 2012',
    description: 'Built and maintained forms-based solutions using Adobe LiveCycle for state government systems.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  },
  {
    id: 13,
    title: 'Adobe LiveCycle Consultant',
    company: 'State Farm Insurance',
    timeframe: 'Aug 2010 - Nov 2011',
    description: 'Served as a LiveCycle Designer expert and business analyst, delivering automated insurance workflows.',
    tech: ['Adobe LiveCycle', 'RESTful WebServices']
  }
];

export const Experience = () => {
  const titleRef = useRef();
  const [titleVisible, setTitleVisible] = useState(false);
  const sectionRef = useRef();
  const isInViewport = useInViewport(sectionRef);
  const isHydrated = useHydrated();
  const [hoveredJob, setHoveredJob] = useState(null);
  const [webGLError, setWebGLError] = useState(false);

  // Handle WebGL errors
  const handleWebGLError = () => {
    console.log('WebGL rendering failed, using fallback background');
    setWebGLError(true);
  };

  // UseCallback for element refs
  const onTitleInViewport = useCallback((inViewport) => {
    setTitleVisible(inViewport);
  }, []);

  return (
    <div className={styles.experience}>
      {isHydrated && !webGLError && (
        <Suspense fallback={<div className={styles.fallbackBackground} />}>
          <ErrorBoundary onError={handleWebGLError}>
            <ExperienceBackground />
          </ErrorBoundary>
        </Suspense>
      )}
      
      {webGLError && (
        <>
          <div className={styles.fallbackBackground} />
          <div className={styles.linePattern} />
          <div className={styles.animatedLines} />
        </>
      )}
      
      <Section className={styles.content} ref={sectionRef}>
        <div className={styles.heading}>
          <h1 className={styles.title} data-visible={titleVisible} ref={titleRef}>
            <DecoderText text="Experience" delay={300} onComplete={() => setTitleVisible(true)} />
          </h1>
        </div>
        
        <ul className={styles.jobList}>
          {jobs.map((job, index) => (
            <Transition
              key={job.id}
              in={isInViewport}
              timeout={index * 100 + 800}
            >
              {({ visible, nodeRef }) => (
                <li
                  className={styles.job}
                  ref={nodeRef}
                  data-visible={visible}
                  data-highlighted={hoveredJob === job.id}
                  style={cssProps({ delay: index * 0.1 + 0.6 })}
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                >
                  <div className={styles.jobContent}>
                    <div className={styles.jobDetails}>
                      <h2 className={styles.jobTitle}>{job.title}</h2>
                      <span className={styles.jobCompany}>{job.company}</span>
                      <span className={styles.jobLocation}>{job.location}</span>
                      <span className={styles.jobTimeframe}>{job.timeframe}</span>
                      <p className={styles.jobDescription}>{job.description}</p>
                      <div className={styles.jobTech}>
                        {job.tech.map(tech => (
                          <span key={tech} className={styles.techItem}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.smokeEffect} />
                </li>
              )}
            </Transition>
          ))}
        </ul>
      </Section>
      
      <Footer />
    </div>
  );
};

// Error boundary component to catch WebGL errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WebGL error caught:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
} 