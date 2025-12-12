import React from 'react';
import './Header.css';

const Header = ({ 
  title,
  subtitle,
  icon,
  version,
  className = '',
  ...props 
}) => {
  return (
    <div className={`reactbits-header ${className}`} {...props}>
      <div className="reactbits-header-content">
        {icon && (
          <div className="reactbits-header-icon-wrapper">
            <div className="reactbits-header-icon-border">
              <img src={icon} alt="Logo" className="reactbits-header-icon" />
            </div>
          </div>
        )}
        {version && (
          <span className="reactbits-header-version">{version}</span>
        )}
        {title && (
          <h1 className="reactbits-header-title">{title}</h1>
        )}
      </div>
      {subtitle && (
        <p className="reactbits-header-subtitle">{subtitle}</p>
      )}
    </div>
  );
};

export default Header;
