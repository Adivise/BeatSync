import React from 'react';
import './Input.css';

const Input = ({ 
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`reactbits-input-wrapper ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="reactbits-input"
        {...props}
      />
      <span className="reactbits-input-border"></span>
      <span className="reactbits-input-glow"></span>
    </div>
  );
};

export default Input;
