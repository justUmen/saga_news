import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  //Don't show the button if already on top of the page (not like on richemont.com)
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  //Back on top of the page Smooooothly
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  //Button on top of everything, at the bottom right of the screen
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {isVisible && (
        <IconButton 
          onClick={handleScrollToTop} 
          aria-label="scroll to top" 
          style={{
            color: 'white',
            backgroundColor: '#1976d2',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ScrollToTopButton;
