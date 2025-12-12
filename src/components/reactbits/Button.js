import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'gradient', 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`reactbits-button reactbits-button--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="reactbits-button-content">{children}</span>
      <span className="reactbits-button-shine"></span>
    </button>
  );
};

export default Button;
