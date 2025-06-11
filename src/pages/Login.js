import React, { useState, useEffect } from "react";
import HistoryRequest from "../components/HistoryRequest.js";
import Header from "../components/Header.js";
import "./Login.css";

const Login = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data.maps);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const twitchLogin = () => {
    window.open('/api/auth/twitch/twitch', '_self');
  };

  const osuLogin = () => {
    window.open('/api/auth/osu/osu', '_self');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem'}}>
          <div className="loading-spinner" />
          <img
            src="https://img.icons8.com/stickers/100/osu.png"
            alt="osu! Logo"
            className="loading-osu-logo"
            style={{width: 48, height: 48, marginTop: '0.5rem'}}
          />
          <div style={{color: '#ff66aa', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '1px', textShadow: '0 2px 8px #0008'}}>Syncing your beatmaps...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <HistoryRequest requests={requests} />
      <div className="login-buttons">
        <button className="btn twitch-btn" onClick={twitchLogin}>
          <span>Login with Twitch</span>
          <img src="https://img.icons8.com/fluency/48/twitch.png" alt="Twitch Logo" className="twitch-logo"/>
        </button>
        <button className="btn osu-btn" onClick={osuLogin}>
          <span>Login with osu!</span>
          <img src="https://img.icons8.com/stickers/100/osu.png" alt="osu! Logo" className="osu-logo"/>
        </button>
      </div>
    </div>
  );
};

export default Login;