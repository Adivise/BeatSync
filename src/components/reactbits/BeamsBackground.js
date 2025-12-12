import React from 'react';
import './BeamsBackground.css';

const BeamsBackground = ({ 
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className={`reactbits-beams-background ${className}`} {...props}>
      <div className="reactbits-beams-container">
        <div className="reactbits-beam reactbits-beam-1"></div>
        <div className="reactbits-beam reactbits-beam-2"></div>
        <div className="reactbits-beam reactbits-beam-3"></div>
        <div className="reactbits-beam reactbits-beam-4"></div>
        <div className="reactbits-beam reactbits-beam-5"></div>
        <div className="reactbits-beam reactbits-beam-6"></div>
        <div className="reactbits-beam reactbits-beam-7"></div>
        <div className="reactbits-beam reactbits-beam-8"></div>
      </div>
      <div className="reactbits-beams-content">
        {children}
      </div>
    </div>
  );
};

export default BeamsBackground;
