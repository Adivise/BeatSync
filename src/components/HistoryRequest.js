import React, { useEffect, useRef } from 'react';
import './HistoryRequest.css';

// Constants
const INTERSECTION_OPTIONS = {
  threshold: 0.1, // Trigger when 10% of the item is visible
  rootMargin: '0px 0px -50px 0px', // Start animation slightly before the item comes into view
};

const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

// Utility functions
const getMapInfo = (request) => {
  if (!request.mapInfo) return null;
  return Array.isArray(request.mapInfo) 
    ? (request.mapInfo.length > 0 ? request.mapInfo[0] : null)
    : (typeof request.mapInfo === "object" ? request.mapInfo : null);
};

const getBackgroundUrl = (mapInfo) => {
  return mapInfo?.beatmapset_id
    ? `https://assets.ppy.sh/beatmaps/${mapInfo.beatmapset_id}/covers/cover.jpg`
    : undefined;
};

const getBeatmapLink = (request, mapInfo) => {
  return request.map || (mapInfo?.beatmap_id ? `https://osu.ppy.sh/b/${mapInfo.beatmap_id}` : undefined);
};

const getBeatmapName = (mapInfo) => {
  return mapInfo
    ? `${mapInfo.artist} - ${mapInfo.title} [${mapInfo.version}] by ${mapInfo.creator}`
    : 'Fetching map info...';
};

// Mod Tags Component
const ModTags = ({ mods }) => {
  if (!mods || mods.length === 0) return null;
  
  return (
    <div className="mods">
      {mods.map((mod, modIndex) => (
        <span key={modIndex} className="mod-tag">
          {mod}
        </span>
      ))}
    </div>
  );
};

// History Item Component
const HistoryItem = ({ request }) => {
  const mapInfo = getMapInfo(request);
  const backgroundUrl = getBackgroundUrl(mapInfo);
  const beatmapLink = getBeatmapLink(request, mapInfo);
  const beatmapName = getBeatmapName(mapInfo);

  return (
    <div
      className={`history-item ${backgroundUrl ? 'has-background' : ''}`}
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
    >
      <div className="history-content">
        <span className="username">
          Submitted by: {request.username || 'Unknown User'}
        </span>
        <span className="map-link">
          {beatmapLink ? (
            <a href={beatmapLink} target="_blank" rel="noopener noreferrer">
              {beatmapName}
            </a>
          ) : (
            <span>
              {mapInfo ? beatmapName : <em>Fetching map info...</em>}
            </span>
          )}
        </span>
        <span className="request-time">
          {request.createdAt
            ? new Date(request.createdAt).toLocaleString("en-US", DATE_FORMAT_OPTIONS)
            : ""}
        </span>
      </div>
      <ModTags mods={request.mods} />
    </div>
  );
};

// Custom hook for intersection observer
const useIntersectionObserver = (requests) => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      INTERSECTION_OPTIONS
    );

    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach((item) => {
      observerRef.current.observe(item);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [requests]);

  return observerRef;
};

// Main Component
const HistoryRequest = ({ requests }) => {
  useIntersectionObserver(requests);

  return (
    <div className="history-scrollbox">
      {(!requests || requests.length === 0) ? (
        <p className="no-requests">No requests yet</p>
      ) : (
        requests.map((request) => (
          <HistoryItem key={request._id} request={request} />
        ))
      )}
    </div>
  );
};

export default HistoryRequest;

