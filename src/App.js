import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Authorized from "./pages/Authorized.js";
import Nav from "./components/Nav.js";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const [user, setUser] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Try Twitch auth first
        const twitchResponse = await fetch(`/api/auth/twitch/login/success`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        const twitchData = await twitchResponse.json();
        
        if (twitchResponse.ok && twitchData.success) {
          const twitchUser = {
            username: twitchData.user.login,
            avatar: twitchData.user.profile_image_url,
            service: 'twitch'
          };

          setUser(twitchUser);
          setAuthSuccess(true);
          setLoading(false);
          return;
        }

        // If Twitch auth fails, try osu! auth
        const osuResponse = await fetch(`/api/auth/osu/login/success`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        const osuData = await osuResponse.json();
        
        if (osuResponse.ok && osuData.success) {
          const osuUser = {
            username: osuData.user.username,
            avatar: osuData.user.avatar_url,
            country_code: osuData.user.country_code,
            service: 'osu'
          };

          setUser(osuUser);
          setAuthSuccess(true);
          setLoading(false);
          return;
        }

        // If both auth methods fail
        setUser(null);
        setAuthSuccess(false);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        setUser(null);
        setAuthSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem'}}>
          <div className="loading-spinner" />
          <div className="loading-message">Syncing your beatmaps...</div>
        </div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Analytics />
      <div>
        <Nav user={user} />
        <Routes>
          {/* ✅ Redirect `/` to `/login` if user is not logged in */}
          <Route path="/" element={user ? <Authorized user={user} success={authSuccess} /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        </Routes>
        <ToastContainer 
          autoClose={3500} 
          position="bottom-right"
          theme="dark"
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
        />
      </div>
    </BrowserRouter>
  );
}