import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Authorized from "./pages/Authorized.js";
import Nav from "./components/Nav.js";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const [user, setUser] = useState(null);
  const [twitchSuccess, setTwitchSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/auth/login/success`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        const resObject = await response.json();
        
        if (response.ok && resObject.success) {
          setUser(resObject.user);
          setTwitchSuccess(true);
        } else {
          setUser(null);
          setTwitchSuccess(false);
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        setUser(null);
        setTwitchSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>; // Prevent UI flickering
  }
  
  return (
    <BrowserRouter>
      <Analytics />
      <div>
        <Nav user={user} />
        <Routes>
          {/* ✅ Redirect `/` to `/login` if user is not logged in */}
          <Route path="/" element={user ? <Authorized user={user} success={twitchSuccess} /> : <Navigate to="/login" />} />
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