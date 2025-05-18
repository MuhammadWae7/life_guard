
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mouseover', onMouseOver);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setLinkHovered(
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') !== null || 
        target.closest('button') !== null
      );
    };

    // Add a class to the html element to remove default cursor
    document.documentElement.classList.add('has-custom-cursor');

    addEventListeners();
    return () => {
      removeEventListeners();
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  // Click animation effect
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleClick = () => {
    setClickEffect({
      x: position.x,
      y: position.y,
      id: Math.random()
    });

    setTimeout(() => {
      setClickEffect(null);
    }, 1000);
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [position]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/50 pointer-events-none z-50"
        style={{ 
          mixBlendMode: 'difference'
        }}
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: clicked ? 0.8 : linkHovered ? 1.5 : 1,
          opacity: hidden ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />
      <motion.div
        className="fixed top-0 left-0 h-4 w-4 rounded-full bg-blue-500 pointer-events-none z-50"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          opacity: hidden ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 30,
          mass: 0.2
        }}
      />
      
      {/* Click effect animation */}
      {clickEffect && (
        <motion.div
          key={clickEffect.id}
          className="fixed h-12 w-12 rounded-full border-2 border-blue-500 pointer-events-none z-40"
          style={{
            left: clickEffect.x - 24,
            top: clickEffect.y - 24
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </>
  );
};

export default AnimatedCursor;
