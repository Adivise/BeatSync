import React, { useState } from "react";
import "./Nav.css";

const Nav = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = async () => {
    try {
      // Use the service field to determine which logout endpoint to call
      const logoutUrl = `/api/auth/${user.service}/logout`;
      window.open(logoutUrl, "_self");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav id="functions" className="nav-container">
      {/* User Profile */}
      <div className="func-box user-profile" onClick={toggleMenu}>
        <span data-set="user-profile" aria-expanded="false">
          <img 
            src={user.avatar || "https://static-cdn.jtvnw.net/jtv_user_pictures/default-profile_image.png"} 
            alt="User Profile" 
          />
        </span>

        {/* Animated Dropdown Menu */}
        <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
          <p>{user.username}</p>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
