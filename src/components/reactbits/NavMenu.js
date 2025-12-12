import React, { useState, useRef, useEffect } from 'react';
import './NavMenu.css';

const NavMenu = ({ 
  children,
  trigger,
  position = 'bottom-right',
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      className={`reactbits-nav-menu reactbits-nav-menu--${position} ${className}`}
      ref={menuRef}
      {...props}
    >
      <div 
        className="reactbits-nav-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>
      <div className={`reactbits-nav-menu-dropdown ${isOpen ? 'reactbits-nav-menu-dropdown--open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default NavMenu;
