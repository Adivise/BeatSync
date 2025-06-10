import React, { useEffect, useRef } from 'react';
import './HistoryRequest.css';

const HistoryRequest = ({ requests }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    // Create the observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once the item is visible, we can stop observing it
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before the item comes into view
      }
    );

    // Observe all history items
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach((item) => {
      observerRef.current.observe(item);
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [requests]); // Re-run when requests change

  return (
    <>
      <div className="history-scrollbox">
        {(!requests || requests.length === 0) ? (
          <p className="no-requests">No requests yet</p>
        ) : (
          requests.map((request) => {
            // Defensively handle mapInfo (array or object) and extract the first item if an array
            const mapInfo = Array.isArray(request.mapInfo) ? (request.mapInfo.length > 0 ? request.mapInfo[0] : null) : (request.mapInfo && typeof request.mapInfo === "object" ? request.mapInfo : null);
            const hasMapInfo = !!mapInfo;
            const backgroundUrl =
              (hasMapInfo && mapInfo.beatmapset_id)
                ? `https://assets.ppy.sh/beatmaps/${mapInfo.beatmapset_id}/covers/cover.jpg`
                : undefined;

            const beatmapLink =
              request.map ||
              (hasMapInfo && mapInfo.beatmap_id
                ? `https://osu.ppy.sh/b/${mapInfo.beatmap_id}`
                : undefined);

            const beatmapName =
              hasMapInfo
                ? `${mapInfo.artist} - ${mapInfo.title} [${mapInfo.version}] by ${mapInfo.creator}`
                : 'Fetching map info...';

            return (
              <div
                key={request._id} 
                className={`history-item ${backgroundUrl ? 'has-background' : ''}`}
                style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
              >
                <div className="history-content">
                  <span className="username">Submitted by: {request.username || 'Unknown User'}</span>
                  <span className="map-link">
                    {beatmapLink ? (
                      <a href={beatmapLink} target="_blank" rel="noopener noreferrer">
                        {beatmapName}
                      </a>
                    ) : (
                      <span>
                        {hasMapInfo ? beatmapName : <em>Fetching map info...</em>}
                      </span>
                    )}
                  </span>
                  <span className="request-time">
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </span>
                </div>
                {request.mods && request.mods.length > 0 && (
                  <div className="mods">
                    {request.mods.map((mod, modIndex) => (
                      <span key={modIndex} className="mod-tag">
                        {mod}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default HistoryRequest;

