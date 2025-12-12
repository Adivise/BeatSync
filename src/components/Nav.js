import React from "react";
import NavMenu from "./reactbits/NavMenu.js";
import Button from "./reactbits/Button.js";
import "./Nav.css";

const Nav = ({ user }) => {
  if (!user) return null;

  const logout = async () => {
    try {
      // Use the service field to determine which logout endpoint to call
      const logoutUrl = `/api/auth/${user.service}/logout`;
      window.open(logoutUrl, "_self");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav id="functions" className="nav-container">
      <NavMenu
        position="bottom-right"
        trigger={
          <div className="func-box user-profile">
            <img 
              src={user.avatar || "https://static-cdn.jtvnw.net/jtv_user_pictures/default-profile_image.png"} 
              alt="User Profile" 
            />
          </div>
        }
      >
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
          <p style={{ color: 'white', fontSize: '12px', margin: 0, padding: '4px' }}>{user.username}</p>
          <p style={{ color: '#86eaff', fontSize: '11px', margin: 0, padding: '0 4px 2px 4px' }}>
            Logged in via {user.service === 'osu' ? 'osu!' : user.service === 'twitch' ? 'Twitch' : user.service}
          </p>
          <Button 
            variant="glow" 
            onClick={logout}
            className="reactbits-button--small"
            style={{ width: '100%', background: 'rgba(255, 0, 0, 0.5)', fontSize: '12px', padding: '4px 8px' }}
          >
            Logout
          </Button>
        </div>
      </NavMenu>
    </nav>
  );
};

export default Nav;
