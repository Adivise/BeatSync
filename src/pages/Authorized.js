import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import HistoryRequest from "../components/HistoryRequest.js";
import Header from "../components/Header.js";
import "./Authorized.css";
import Select from "react-select";

const modOptions = [
  { value: "EZ", label: "Easy" },
  { value: "NF", label: "No-Fail" },
  { value: "HT", label: "Half Time" },
  { value: "HD", label: "Hidden" },
  { value: "HR", label: "Hard Rock" },
  { value: "DT", label: "Double Time" },
  { value: "FL", label: "Flashlight" },
  { value: "RX", label: "Relax" }
];

const Authorized = ({ user, twitchSuccess }) => {
  const [map, setMap] = useState("");
  const [selectedMods, setSelectedMods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModSelect, setShowModSelect] = useState(false);
  const [modDropdownVisible, setModDropdownVisible] = useState(false);
  const [modDropdownActive, setModDropdownActive] = useState(false);
  const modDropdownRef = useRef(null);

  // Define fetchRequests once at the top level
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/api/requests`);
      if (res.status === 200 && res.data && Array.isArray(res.data.maps)) {
        setRequests(res.data.maps);
        console.log('Fetched requests:', res.data.maps); // Debug log
      } else {
        console.error('Invalid response format:', res.data);
        toast.error("Invalid response format from server");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (twitchSuccess && user?.login) {
      setMap("");
    }
    fetchRequests();
  }, [twitchSuccess, user]);

  // Handle fade in/out animation
  useEffect(() => {
    if (showModSelect) {
      setModDropdownVisible(true);
      // Wait for the dropdown to mount, then activate the fade-in
      setTimeout(() => setModDropdownActive(true), 10);
    } else if (modDropdownVisible) {
      setModDropdownActive(false);
      // Wait for fade-out before unmounting
      const timeout = setTimeout(() => setModDropdownVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [showModSelect]);

  const handleMap = (e) => {
    setMap(e.target.value);
  };

  const handleModChange = (mods) => {
    if (mods.length > 2) return;
    setSelectedMods(mods);
  };

  // Polling function to update requests until the latest has mapInfo
  const pollForMapInfo = (latestId) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/requests`);
        if (res.status === 200 && res.data && Array.isArray(res.data.maps)) {
          setRequests(res.data.maps);
          // Find the latest request by id
          const latest = res.data.maps.find(req => req._id === latestId);
          if (latest && latest.mapInfo && Object.keys(latest.mapInfo).length > 0) {
            clearInterval(interval);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!map.trim()) return toast.error("Please enter a map link.");
    if (!user?.login) {
      return toast.error("Login required!");
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/sender`, {
        map,
        mods: selectedMods.map((mod) => mod.value),
        username: user.login
      });

      if (res.status === 200 && res.data && res.data.id) {
        toast.success(`Map submitted with ${selectedMods.map((mod) => mod.label).join(", ")} by ${user.login}`);
        setMap("");
        setSelectedMods([]);
        await fetchRequests();
        pollForMapInfo(res.data.id);
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Submission failed. If the problem persists, please contact the server owner.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <HistoryRequest requests={requests} />
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <input
            className="input-field"
            onChange={handleMap}
            value={map}
            type="text"
            placeholder="Enter your osu! map link"
          />
          <button
            className="fox-button"
            type="button"
            style={{ width: 30, marginRight: 0, height: 30, borderRadius: 8, background: "#0000009c", color: "#fff", border: "none", fontWeight: 700, fontSize: 18, cursor: "pointer" }}
            onClick={() => setShowModSelect((v) => !v)}
            aria-label="Select mods"
          >
            {showModSelect ? "-" : "+"}
          </button>
          <button className="fox-button" disabled={submitting} style={{ background: "#0000009c" }}>
            {submitting ? "Send..." : "Send"}
          </button>
        </div>
        {modDropdownVisible && (
          <div
            id="mods-container"
            ref={modDropdownRef}
            style={{
              opacity: modDropdownActive ? 1 : 0,
              transform: modDropdownActive ? "translateY(0)" : "translateY(-10px)",
              pointerEvents: modDropdownActive ? "auto" : "none",
              transition: "opacity 0.2s, transform 0.2s"
            }}
          >
            <Select
              id="mods-selection"
              options={modOptions}
              isMulti
              value={selectedMods}
              onChange={handleModChange}
              placeholder="No Mods Selected"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              isOptionDisabled={() => selectedMods.length >= 2}
            />
          </div>
        )}
        <p className="example-text">
          Example: https://osu.ppy.sh/beatmapsets/461744#osu/1031991
        </p>
      </form>
    </div>
  );
};

export default Authorized;