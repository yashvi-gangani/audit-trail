import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Rewind,
  FastForward,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  MapPin,
  Truck,
  ShieldAlert,
} from "lucide-react";
import { getShipmentReplay } from "../services/api";

export default function StateScrubber({ shipment, events = [], onScrubStateChange }) {
  const totalVersions = events.length > 0 ? events.length : (shipment?.lastEventVersion || 1);
  
  const [targetVersion, setTargetVersion] = useState(totalVersions);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayData, setReplayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState("live"); // 'live' | '3days' | 'initial' | 'custom'

  const playTimerRef = useRef(null);

  // Sync total version if shipment changes
  useEffect(() => {
    if (shipment) {
      setTargetVersion(totalVersions);
      setActivePreset("live");
    }
  }, [shipment?.aggregateId, totalVersions]);

  // Fetch reconstructed state whenever targetVersion or shipment changes
  useEffect(() => {
    if (!shipment?.aggregateId) return;

    let isMounted = true;

    const fetchReplay = async () => {
      try {
        setLoading(true);

        let params = {};
        if (activePreset === "3days") {
          params = { daysAgo: 3 };
        } else {
          params = { targetVersion };
        }

        const res = await getShipmentReplay(shipment.aggregateId, params);
        if (isMounted && res?.data) {
          setReplayData(res.data);
          if (onScrubStateChange) {
            onScrubStateChange(res.data.reconstructedState);
          }
        }
      } catch (err) {
        console.error("Failed to replay shipment state:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReplay();

    return () => {
      isMounted = false;
    };
  }, [shipment?.aggregateId, targetVersion, activePreset]);

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setTargetVersion((prev) => {
          if (prev >= totalVersions) {
            setIsPlaying(false);
            return totalVersions;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, totalVersions]);

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setTargetVersion(val);
    setActivePreset("custom");
    if (isPlaying) setIsPlaying(false);
  };

  const handlePreset3Days = () => {
    setActivePreset("3days");
    if (isPlaying) setIsPlaying(false);
  };

  const handlePresetInitial = () => {
    setTargetVersion(1);
    setActivePreset("initial");
    if (isPlaying) setIsPlaying(false);
  };

  const handlePresetLive = () => {
    setTargetVersion(totalVersions);
    setActivePreset("live");
    if (isPlaying) setIsPlaying(false);
  };

  const reconstructed = replayData?.reconstructedState || shipment;
  const currentEvent = events[targetVersion - 1] || null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#f8fafc",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              background: "rgba(59, 130, 246, 0.2)",
              border: "1px solid #3b82f6",
              padding: "0.4rem",
              borderRadius: "8px",
              display: "flex",
            }}
          >
            <Clock size={20} style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>
              Time-Travel State Scrubber
            </h3>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>
              Rewind event history to reconstruct exact historical ledger state
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={handlePresetInitial}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: activePreset === "initial" ? "1px solid #3b82f6" : "1px solid #334155",
              background: activePreset === "initial" ? "#1e40af" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Rewind size={13} /> Initial
          </button>

          <button
            onClick={handlePreset3Days}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: activePreset === "3days" ? "1px solid #8b5cf6" : "1px solid #334155",
              background: activePreset === "3days" ? "#6d28d9" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              boxShadow: activePreset === "3days" ? "0 0 12px rgba(139, 92, 246, 0.4)" : "none",
            }}
          >
            <Clock size={13} /> 3 Days Ago
          </button>

          <button
            onClick={handlePresetLive}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: activePreset === "live" ? "1px solid #10b981" : "1px solid #334155",
              background: activePreset === "live" ? "#065f46" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <FastForward size={13} /> Live Current State
          </button>
        </div>
      </div>

      {/* Slider Control */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#cbd5e1" }}>
          <span>
            Scrubbed Version: <strong style={{ color: "#38bdf8" }}>V{targetVersion}</strong> / V{totalVersions}
          </span>
          <span>
            Cutoff Timestamp:{" "}
            <strong style={{ color: "#a78bfa" }}>
              {replayData?.cutoffTimestamp
                ? new Date(replayData.cutoffTimestamp).toLocaleString()
                : currentEvent?.timestamp
                ? new Date(currentEvent.timestamp).toLocaleString()
                : "Live Current"}
            </strong>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "none",
              background: isPlaying ? "#ef4444" : "#3b82f6",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
              flexShrink: 0,
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
          </button>

          {/* Range Slider */}
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="range"
              min="1"
              max={totalVersions}
              value={activePreset === "3days" ? (replayData?.targetVersion || targetVersion) : targetVersion}
              onChange={handleSliderChange}
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "4px",
                accentColor: "#38bdf8",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            onClick={() => {
              setTargetVersion(1);
              setIsPlaying(false);
              setActivePreset("custom");
            }}
            title="Reset to Version 1"
            style={{
              background: "transparent",
              border: "1px solid #334155",
              color: "#94a3b8",
              borderRadius: "6px",
              padding: "0.4rem",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Reconstructed State Snapshot Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.85rem",
          background: "rgba(15, 23, 42, 0.6)",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Reconstructed Status */}
        <div style={{ background: "#1e293b", padding: "0.75rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase" }}>Status at Scrubbed Time</span>
          <div style={{ marginTop: "0.3rem", fontWeight: 700, fontSize: "0.95rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Truck size={16} /> {reconstructed?.status || "UNKNOWN"}
          </div>
        </div>

        {/* Reconstructed Location */}
        <div style={{ background: "#1e293b", padding: "0.75rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase" }}>Scrubbed Location</span>
          <div style={{ marginTop: "0.3rem", fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <MapPin size={16} style={{ color: "#ec4899" }} /> {reconstructed?.currentLocation || reconstructed?.origin || "In Transit"}
          </div>
        </div>

        {/* Reconstructed Temp */}
        <div style={{ background: "#1e293b", padding: "0.75rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase" }}>Telemetry Temp</span>
          <div style={{ marginTop: "0.3rem", fontWeight: 700, fontSize: "0.95rem", color: reconstructed?.temperature > 8 || reconstructed?.temperature < 2 ? "#f87171" : "#4ade80", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Thermometer size={16} />{" "}
            {reconstructed?.temperature !== null && reconstructed?.temperature !== undefined
              ? `${reconstructed.temperature} °C`
              : "N/A"}
          </div>
        </div>

        {/* Risk Level */}
        <div style={{ background: "#1e293b", padding: "0.75rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase" }}>Assessed Risk</span>
          <div style={{ marginTop: "0.3rem", fontWeight: 700, fontSize: "0.95rem", color: reconstructed?.risk?.riskLevel === "HIGH" ? "#f87171" : "#4ade80", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <ShieldAlert size={16} /> {reconstructed?.risk?.riskLevel || "LOW"}
          </div>
        </div>
      </div>

      {/* Scrubbed Event Payload Summary */}
      {currentEvent && (
        <div
          style={{
            fontSize: "0.78rem",
            background: "rgba(30, 41, 59, 0.5)",
            padding: "0.6rem 0.8rem",
            borderRadius: "6px",
            color: "#cbd5e1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            📍 <strong>Event Type:</strong> <code style={{ color: "#38bdf8" }}>{currentEvent.eventType}</code>
          </span>
          <span>
            Payload: {JSON.stringify(currentEvent.payload || {})}
          </span>
        </div>
      )}
    </div>
  );
}
