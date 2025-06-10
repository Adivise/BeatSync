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
    window.open('/api/auth/twitch', '_self');
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="container">
      <Header />
      <HistoryRequest requests={requests} />
      <button className="btn twitch-btn" onClick={twitchLogin}>
        <span>Login with Twitch</span>
        <img src="https://img.icons8.com/fluency/48/twitch.png" alt="Twitch Logo" className="twitch-logo"/>
      </button>
    </div>
  );
};

export default Login;