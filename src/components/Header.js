import React from 'react';
import packageJson from '../../package.json';
import HeaderComponent from './reactbits/Header.js';

const Header = () => {
  return (
    <HeaderComponent 
      title="BeatSync"
      subtitle="Request your favorite osu! maps with ease"
      icon="https://img.icons8.com/stickers/100/osu.png"
      version={`v${packageJson.version}`}
    />
  );
};

export default Header;