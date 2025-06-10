import React, { useState } from "react";
import "./Nav.css";

const Nav = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Move useState OUTSIDE condition

  if (!user) return null;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = () => {
    window.open(`/api/auth/logout`, "_self");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  return (
    <nav id="functions" className="nav-container">
      {/* User Profile */}
      <div className="func-box user-profile" onClick={toggleMenu}>
        <span data-set="user-profile" aria-expanded="false">
          <img src={user.profile_image_url || "https://static-cdn.jtvnw.net/jtv_user_pictures/default-profile_image.png"} alt="User Profile" />
        </span>

        {/* Animated Dropdown Menu */}
        <div className={`profile-menu ${menuOpen ? "open" : ""}`}>
          <p>{user.login}</p>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
