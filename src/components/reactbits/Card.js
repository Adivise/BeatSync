import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'glass',
  className = '',
  hover = true,
  ...props 
}) => {
  return (
    <div
      className={`reactbits-card reactbits-card--${variant} ${hover ? 'reactbits-card--hover' : ''} ${className}`}
      {...props}
    >
      <div className="reactbits-card-content">{children}</div>
      <div className="reactbits-card-glow"></div>
    </div>
  );
};

export default Card;
