import React, { useState, useEffect } from "react";
import HistoryRequest from "../components/HistoryRequest.js";
import Header from "../components/reactbits/Header.js";
import Button from "../components/reactbits/Button.js";
import Card from "../components/reactbits/Card.js";
import Spinner from "../components/reactbits/Spinner.js";
import packageJson from "../../package.json";
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
    window.open('/api/auth/twitch/login', '_self');
  };

  const osuLogin = () => {
    window.open('/api/auth/osu/login', '_self');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem'}}>
          <Spinner variant="gradient" />
          <div className="loading-message">Syncing your beatmaps...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header 
        title="BeatSync"
        subtitle="Request your favorite osu! maps with ease"
        icon="https://img.icons8.com/stickers/100/osu.png"
        version={`v${packageJson.version}`}
      />
      <HistoryRequest requests={requests} />
      <Card variant="glass" className="login-buttons-container">
        <div className="login-buttons">
          <Button variant="twitch" onClick={twitchLogin} className="login-button">
            <span>Login with Twitch</span>
            <img src="https://img.icons8.com/fluency/48/twitch.png" alt="Twitch Logo" style={{width: '22px', height: '22px'}}/>
          </Button>
          <Button variant="osu" onClick={osuLogin} className="login-button">
            <span>Login with osu!</span>
            <img src="https://img.icons8.com/stickers/100/osu.png" alt="osu! Logo" style={{width: '22px', height: '22px'}}/>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;