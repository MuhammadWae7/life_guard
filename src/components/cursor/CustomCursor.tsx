
import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [clickAnimations, setClickAnimations] = useState<{ id: number; x: number; y: number }[]>([]);

  // Handle cursor position
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setClicked(true);
      setClickPosition({ x: e.clientX, y: e.clientY });
      
      // Create a new click animation
      const newId = Date.now();
      setClickAnimations(prev => [...prev, { id: newId, x: e.clientX, y: e.clientY }]);
      
      // Remove the animation after it completes
      setTimeout(() => {
        setClickAnimations(prev => prev.filter(animation => animation.id !== newId));
      }, 800);
    };

    const handleMouseUp = () => {
      setClicked(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    // Add html class for styling cursor-interactive elements
    document.documentElement.classList.add('has-custom-cursor');

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div 
        className={`fixed pointer-events-none z-50 h-6 w-6 -ml-3 -mt-3 rounded-full border border-white bg-health-primary/30 backdrop-blur-sm transition-transform duration-200 ${clicked ? 'scale-75' : 'scale-100'}`}
        style={{ left: position.x, top: position.y }}
      />
      <div 
        className="fixed pointer-events-none z-50 h-1 w-1 -ml-0.5 -mt-0.5 rounded-full bg-white"
        style={{ left: position.x, top: position.y }}
      />
      <div 
        className="fixed pointer-events-none z-50 h-10 w-10 -ml-5 -mt-5 rounded-full bg-health-primary opacity-30 animate-cursor-blob"
        style={{ left: position.x, top: position.y }}
      />
      
      {/* Click animations */}
      {clickAnimations.map((animation) => (
        <div 
          key={animation.id}
          className="fixed pointer-events-none z-40 h-10 w-10 -ml-5 -mt-5 rounded-full bg-health-primary animate-click-ripple"
          style={{ left: animation.x, top: animation.y }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
