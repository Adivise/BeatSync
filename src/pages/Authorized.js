import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import HistoryRequest from "../components/HistoryRequest.js";
import Header from "../components/Header.js";
import "./Authorized.css";
import Select from "react-select";

// Constants
const MOD_OPTIONS = [
  { value: "EZ", label: "Easy" },
  { value: "NF", label: "No-Fail" },
  { value: "HT", label: "Half Time" },
  { value: "HD", label: "Hidden" },
  { value: "HR", label: "Hard Rock" },
  { value: "DT", label: "Double Time" },
  { value: "FL", label: "Flashlight" },
  { value: "RX", label: "Relax" }
];

const COOLDOWN_DURATION = 60000; // 1 minute in milliseconds
const POLLING_INTERVAL = 1500; // 1.5 seconds

// Mod Selector Component
const ModSelector = ({ selectedMods, onModChange, showModSelect, onToggleModSelect, modDropdownVisible, modDropdownActive, modDropdownRef }) => {
  return (
    <>
      <button
        className="fox-button"
        type="button"
        style={{ 
          width: 30, 
          marginRight: 0, 
          height: 30, 
          borderRadius: 8, 
          background: "#0000009c", 
          color: "#fff", 
          border: "none", 
          fontWeight: 700, 
          fontSize: 18, 
          cursor: "pointer" 
        }}
        onClick={onToggleModSelect}
        aria-label="Select mods"
      >
        {showModSelect ? "-" : "+"}
      </button>
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
            options={MOD_OPTIONS}
            isMulti
            value={selectedMods}
            onChange={onModChange}
            placeholder="No Mods Selected"
            classNamePrefix="select"
            closeMenuOnSelect={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isOptionDisabled={() => selectedMods.length >= 2}
          />
        </div>
      )}
    </>
  );
};

// Map Submission Form Component
const MapSubmissionForm = ({ 
  map, 
  onMapChange, 
  selectedMods, 
  onModChange, 
  onSubmit, 
  submitting, 
  cooldown,
  showModSelect,
  onToggleModSelect,
  modDropdownVisible,
  modDropdownActive,
  modDropdownRef
}) => {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <div className="form-row">
        <input
          className="input-field"
          onChange={onMapChange}
          value={map}
          type="text"
          placeholder="Enter your osu! map link"
        />
        <ModSelector
          selectedMods={selectedMods}
          onModChange={onModChange}
          showModSelect={showModSelect}
          onToggleModSelect={onToggleModSelect}
          modDropdownVisible={modDropdownVisible}
          modDropdownActive={modDropdownActive}
          modDropdownRef={modDropdownRef}
        />
        <button className="fox-button" disabled={cooldown} style={{ background: "#0000009c" }}>
          {submitting ? "Send..." : cooldown ? "Cooldown..." : "Send"}
        </button>
      </div>
      <p className="example-text">
        Example: https://osu.ppy.sh/beatmapsets/461744#osu/1031991
      </p>
    </form>
  );
};

// Custom hook for managing requests
const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/api/requests`);
      if (res.status === 200 && res.data && Array.isArray(res.data.maps)) {
        setRequests(res.data.maps);
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

  return { requests, loading, fetchRequests };
};

// Custom hook for managing mod dropdown animation
const useModDropdownAnimation = (showModSelect) => {
  const [modDropdownVisible, setModDropdownVisible] = useState(false);
  const [modDropdownActive, setModDropdownActive] = useState(false);

  useEffect(() => {
    if (showModSelect) {
      setModDropdownVisible(true);
      setTimeout(() => setModDropdownActive(true), 10);
    } else if (modDropdownVisible) {
      setModDropdownActive(false);
      const timeout = setTimeout(() => setModDropdownVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [showModSelect]);

  return { modDropdownVisible, modDropdownActive };
};

// Main Component
const Authorized = ({ user, authSuccess }) => {
  const [map, setMap] = useState("");
  const [selectedMods, setSelectedMods] = useState([]);
  const [showModSelect, setShowModSelect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const modDropdownRef = useRef(null);

  const { requests, loading, fetchRequests } = useRequests();
  const { modDropdownVisible, modDropdownActive } = useModDropdownAnimation(showModSelect);

  useEffect(() => {
    if (authSuccess && user?.username) {
      setMap("");
    }
    fetchRequests();
  }, [authSuccess, user]);

  const handleMap = (e) => setMap(e.target.value);

  const handleModChange = (mods) => {
    if (mods.length > 2) return;
    setSelectedMods(mods);
  };

  const pollForMapInfo = (latestId) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/requests`);
        if (res.status === 200 && res.data && Array.isArray(res.data.maps)) {
          setRequests(res.data.maps);
          const latest = res.data.maps.find(req => req._id === latestId);
          if (latest && latest.mapInfo && Object.keys(latest.mapInfo).length > 0) {
            clearInterval(interval);
          }
        }
      } catch (err) {
        // Error handling is optional here as it's a polling operation
      }
    }, POLLING_INTERVAL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown) return toast.error("Please wait 1 minute before submitting again.");
    if (!map.trim()) return toast.error("Please enter a map link.");
    if (!user?.username) return toast.error("Login required!");

    setSubmitting(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), COOLDOWN_DURATION);

    try {
      const res = await axios.post(`/api/sender`, {
        map,
        mods: selectedMods.map((mod) => mod.value),
        username: user.username
      });

      if (res.status === 200 && res.data && res.data.id) {
        toast.success(`Map submitted with ${selectedMods.map((mod) => mod.label).join(", ")} by ${user.username}`);
        setMap("");
        setSelectedMods([]);
        await fetchRequests();
        pollForMapInfo(res.data.id);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error) {
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
      <MapSubmissionForm
        map={map}
        onMapChange={handleMap}
        selectedMods={selectedMods}
        onModChange={handleModChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        cooldown={cooldown}
        showModSelect={showModSelect}
        onToggleModSelect={() => setShowModSelect(v => !v)}
        modDropdownVisible={modDropdownVisible}
        modDropdownActive={modDropdownActive}
        modDropdownRef={modDropdownRef}
      />
    </div>
  );
};

export default Authorized;