import React from 'react';
import packageJson from '../../package.json';
import "./Header.css";

const Header = () => {
  return (
    <div className="header-center">
      <div className="sun-header">
        <div className="avatar-gradient-border">
          <img src="https://img.icons8.com/nolan/64/osu--v2.png" alt="osuLOGO" />
        </div>
        <span className="version">v{packageJson.version}</span>
        <span className="sun-title">BeatSync</span>
      </div>
      <p className="sun-subtitle">Request your favorite osu! maps with ease</p>
    </div>
  );
};

export default Header;