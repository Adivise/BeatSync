import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Authorized from "./pages/Authorized.js";
import Nav from "./components/Nav.js";
import Spinner from "./components/reactbits/Spinner.js";
import BeamsBackground from "./components/reactbits/BeamsBackground.js";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const [user, setUser] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      setUser(null);
      setAuthSuccess(false);
      let found = false;
      try {
        // Fetch both statuses in parallel
        const [twitchResp, osuResp] = await Promise.all([
          fetch("/api/auth/twitch/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }),
          fetch("/api/auth/osu/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }),
        ]);
        let twitchData = {};
        let osuData = {};
        try { twitchData = await twitchResp.json(); } catch {}
        try { osuData = await osuResp.json(); } catch {}
        if (twitchResp.ok && twitchData.success) {
          setUser({
            username: twitchData.user.login,
            avatar: twitchData.user.profile_image_url,
            service: "twitch",
          });
          setAuthSuccess(true);
          found = true;
        } else if (osuResp.ok && osuData.success) {
          setUser({
            username: osuData.user.username,
            avatar: osuData.user.avatar_url,
            country_code: osuData.user.country_code,
            service: "osu",
          });
          setAuthSuccess(true);
          found = true;
        }
        if (!found) {
          setUser(null);
          setAuthSuccess(false);
        }
      } catch (err) {
        // Only log truly unexpected errors (not 400/401 from fetch)
        // Do NOT log otherwise, keep console clean
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <BeamsBackground>
        <div className="loading-screen">
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem'}}>
            <Spinner variant="gradient" />
            <div className="loading-message">Syncing your beatmaps...</div>
          </div>
        </div>
      </BeamsBackground>
    );
  }
  
  return (
    <BrowserRouter>
      <Analytics />
      <BeamsBackground>
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
      </BeamsBackground>
    </BrowserRouter>
  );
}