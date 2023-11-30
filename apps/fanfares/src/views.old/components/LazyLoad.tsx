import { useEffect, useRef, useState } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  placeholder: React.ReactNode;
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children, placeholder }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
          }
        });
      },
      {
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return <div ref={ref}>{isLoaded ? children : placeholder}</div>;
};

export default LazyLoad;
