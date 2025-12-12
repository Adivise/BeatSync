import React from 'react';
import './Spinner.css';

const Spinner = ({ 
  size = 'medium',
  variant = 'gradient',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`reactbits-spinner reactbits-spinner--${variant} reactbits-spinner--${size} ${className}`}
      {...props}
    >
      <div className="reactbits-spinner-ring"></div>
      <div className="reactbits-spinner-ring"></div>
      <div className="reactbits-spinner-ring"></div>
    </div>
  );
};

export default Spinner;
