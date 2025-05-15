import { useRef, useState, useCallback, Suspense, lazy, useEffect } from 'react';
import React from 'react';
import { Footer } from '~/components/footer';
import { Section } from '~/components/section';
import { DecoderText } from '~/components/decoder-text';
import { Transition } from '~/components/transition';
import { useInViewport } from '~/hooks';
import { cssProps } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { useHydrated } from '~/hooks/useHydrated';
import { useInterval, useScrollToHash } from '~/hooks';
import { useTheme } from '~/components/theme-provider';
import { tokens } from '~/components/theme-provider/theme';
import styles from './skills.module.css';

// Import DisplacementSphere from home page
const DisplacementSphere = lazy(() =>
  import('~/routes/home/displacement-sphere').then(module => ({ default: module.DisplacementSphere }))
);

export const meta = () => {
  return baseMeta({
    title: 'Technical Skills',
    description: 'Technical skills, expertise, and endorsements in technologies, programming languages, and methodologies.',
  });
};

// Skills data with categories
const skillsData = [
  {
    id: 1,
    name: 'AIOps & AI Ops',
    company: 'Specialist Leader at Deloitte Digital',
    category: 'AI & ML'
  },
  {
    id: 2,
    name: 'Python (Programming Language)',
    company: '4 experiences across Deloitte Digital and 2 other companies',
    category: 'Programming'
  },
  {
    id: 3,
    name: 'Machine Learning',
    company: '4 experiences across Deloitte Digital and 2 other companies',
    category: 'AI & ML'
  },
  {
    id: 4,
    name: 'Artificial Intelligence (AI)',
    company: 'Specialist Leader at Deloitte Digital',
    category: 'AI & ML'
  },
  {
    id: 5,
    name: 'RESTful WebServices',
    company: '18 experiences across Deloitte Digital and 12 other companies',
    category: 'Web'
  },
  {
    id: 6,
    name: 'Adobe Experience Manager (AEM)',
    company: '6 experiences across Deloitte Digital and 4 other companies',
    category: 'Adobe'
  },
  {
    id: 7,
    name: 'SOA',
    company: 'Enterprise Architecture',
    category: 'Architecture'
  },
  {
    id: 8,
    name: 'Adobe LiveCycle Designer',
    company: 'Adobe Specialist',
    category: 'Adobe'
  },
  {
    id: 9,
    name: 'Android',
    company: 'Mobile Development',
    category: 'Mobile'
  },
  {
    id: 10,
    name: 'Web Development',
    company: 'Full Stack Development',
    category: 'Web'
  },
  {
    id: 11,
    name: 'Adobe LiveCycle',
    company: '18 experiences across Deloitte Digital and 12 other companies',
    category: 'Adobe'
  },
  {
    id: 12,
    name: 'Agile Methodologies',
    company: 'Project Management Professional (PMP)®',
    category: 'Management'
  },
  {
    id: 13,
    name: 'Web Services',
    company: 'API Development',
    category: 'Web'
  },
  {
    id: 14,
    name: 'SDLC',
    company: 'Software Development Lifecycle Expert',
    category: 'Management'
  },
  {
    id: 15,
    name: 'XML',
    company: 'Data Integration',
    category: 'Programming'
  },
  {
    id: 16,
    name: 'Java Enterprise Edition',
    company: 'Enterprise Development',
    category: 'Programming'
  },
  {
    id: 17,
    name: 'SQL',
    company: 'Database Development',
    category: 'Database'
  },
  {
    id: 18,
    name: 'Java',
    company: 'Backend Development',
    category: 'Programming'
  },
  {
    id: 19,
    name: 'Software Development',
    company: 'Software Engineering',
    category: 'Programming'
  },
  {
    id: 20,
    name: 'Databases',
    company: 'Data Management',
    category: 'Database'
  },
  {
    id: 21,
    name: 'Requirements Analysis',
    company: 'Business Requirements',
    category: 'Management'
  },
  {
    id: 22,
    name: 'SOAP',
    company: 'Legacy Integration',
    category: 'Web'
  },
  {
    id: 23,
    name: 'Spring',
    company: 'Java Framework',
    category: 'Programming'
  },
  {
    id: 24,
    name: 'Consulting',
    company: 'Digital Transformation',
    category: 'Management'
  },
  {
    id: 25,
    name: 'Oracle',
    company: 'Enterprise Database',
    category: 'Database'
  },
  {
    id: 26,
    name: 'Business Analysis',
    company: 'Process Optimization',
    category: 'Management'
  }
];

// Get unique categories
const categories = [...new Set(skillsData.map(skill => skill.category))];

export const Skills = () => {
  const titleRef = useRef();
  const [titleVisible, setTitleVisible] = useState(false);
  const sectionRef = useRef();
  const isInViewport = useInViewport(sectionRef);
  const isHydrated = useHydrated();
  const [currentCategory, setCurrentCategory] = useState('All');
  const { theme } = useTheme();
  const prevTheme = useRef(theme);
  const [highlight, setHighlight] = useState(null);
  const [webGLError, setWebGLError] = useState(false);

  // Rotate categories
  useInterval(
    () => {
      if (currentCategory === 'All') {
        setCurrentCategory(categories[0]);
      } else {
        const currentIndex = categories.indexOf(currentCategory);
        const nextIndex = (currentIndex + 1) % categories.length;
        if (nextIndex === 0) {
          setCurrentCategory('All');
        } else {
          setCurrentCategory(categories[nextIndex]);
        }
      }
    },
    6000,
    theme
  );

  // Effect for theme change
  useEffect(() => {
    if (prevTheme.current && prevTheme.current !== theme) {
      setCurrentCategory('All');
    }
    prevTheme.current = theme;
  }, [theme]);

  // Handle WebGL errors
  const handleWebGLError = () => {
    console.log('WebGL rendering failed, using fallback background');
    setWebGLError(true);
  };

  // UseCallback for element refs
  const onTitleInViewport = useCallback((inViewport) => {
    setTitleVisible(inViewport);
  }, []);

  // Filter skills based on category
  const filteredSkills = currentCategory === 'All' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === currentCategory);
  
  return (
    <div className={styles.skills}>
      {isHydrated && !webGLError && (
        <Suspense fallback={<div className={styles.fallbackBackground} />}>
          <ErrorBoundary onError={handleWebGLError}>
            <DisplacementSphere />
          </ErrorBoundary>
        </Suspense>
      )}
      
      {webGLError && <div className={styles.fallbackBackground} />}
      
      <Section className={styles.content} ref={sectionRef}>
        <div className={styles.heading}>
          <h1 className={styles.title} data-visible={titleVisible} ref={titleRef}>
            <DecoderText text="Technical Skills" delay={300} onComplete={() => setTitleVisible(true)} />
          </h1>
        </div>

        <div className={styles.categories}>
          <button 
            className={styles.categoryButton} 
            data-selected={currentCategory === 'All'} 
            onClick={() => setCurrentCategory('All')}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category} 
              className={styles.categoryButton} 
              data-selected={currentCategory === category}
              onClick={() => setCurrentCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className={styles.skillsContainer}>
          <Transition in={isInViewport} timeout={1000}>
            {({ visible }) => (
              <>
                {filteredSkills.map((skill, index) => (
                  <Transition
                    key={skill.id}
                    in={visible}
                    timeout={index * 100 + 800}
                  >
                    {({ visible: itemVisible, nodeRef }) => (
                      <div
                        className={styles.skillItem}
                        ref={nodeRef}
                        data-visible={itemVisible}
                        data-highlighted={highlight === skill.id}
                        data-category={skill.category}
                        style={cssProps({ delay: index * 0.1 + 0.5 })}
                        onMouseEnter={() => setHighlight(skill.id)}
                        onMouseLeave={() => setHighlight(null)}
                      >
                        <div className={styles.skillContent}>
                          <h3 className={styles.skillName}>{skill.name}</h3>
                          {skill.company && (
                            <div className={styles.skillCompany}>{skill.company}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </Transition>
                ))}
              </>
            )}
          </Transition>
        </div>
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