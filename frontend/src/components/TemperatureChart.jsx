import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
} from "recharts";
import { Thermometer, ShieldCheck, AlertTriangle, Activity } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isExcursion = data.temperature > 8 || data.temperature < 2;

    return (
      <div
        style={{
          background: "#0f172a",
          border: isExcursion ? "1px solid #ef4444" : "1px solid #3b82f6",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          color: "#f8fafc",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
          fontSize: "0.8rem",
        }}
      >
        <div style={{ fontWeight: "bold", color: "#94a3b8", marginBottom: "0.3rem" }}>
          ⏰ {data.formattedTime || label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: 700 }}>
          <Thermometer size={16} style={{ color: isExcursion ? "#ef4444" : "#4ade80" }} />
          <span>{data.temperature} °C</span>
          {isExcursion ? (
            <span
              style={{
                fontSize: "0.68rem",
                background: "rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #ef4444",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <AlertTriangle size={10} /> Excursion Alert
            </span>
          ) : (
            <span
              style={{
                fontSize: "0.68rem",
                background: "rgba(16, 185, 129, 0.2)",
                color: "#4ade80",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #10b981",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <ShieldCheck size={10} /> Safe Range (2-8°C)
            </span>
          )}
        </div>

        {data.eventName && (
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.4rem",
              borderTop: "1px dashed rgba(255, 255, 255, 0.15)",
              color: "#38bdf8",
              fontWeight: 600,
            }}
          >
            📍 Event: {data.eventName}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function TemperatureChart({ events = [], shipment }) {
  // Construct timeline chart data from events or simulated sensor telemetry
  const prepareChartData = () => {
    if (events && events.length > 0) {
      return events.map((evt, idx) => {
        const timeStr = evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `T+${idx * 4}h`;
        const temp = evt.payload?.temperature ?? (shipment?.temperature ?? 4.5);
        return {
          id: evt.id || idx,
          time: timeStr,
          formattedTime: evt.timestamp ? new Date(evt.timestamp).toLocaleString() : timeStr,
          temperature: temp,
          eventName: evt.eventType,
          isEventMarker: true,
        };
      });
    }

    // Default simulation curve if no stream events provided
    const baseTemp = shipment?.temperature ?? 4.2;
    return [
      { time: "00:00", formattedTime: "Day 1, 00:00", temperature: baseTemp, eventName: "CONTAINER_CREATED" },
      { time: "04:00", formattedTime: "Day 1, 04:00", temperature: baseTemp + 0.3 },
      { time: "08:00", formattedTime: "Day 1, 08:00", temperature: baseTemp + 0.8, eventName: "LOADED_ON_SHIP" },
      { time: "12:00", formattedTime: "Day 1, 12:00", temperature: baseTemp + 1.2 },
      { time: "16:00", formattedTime: "Day 1, 16:00", temperature: 9.8, eventName: "TEMPERATURE_SPIKE" }, // Excursion
      { time: "20:00", formattedTime: "Day 1, 20:00", temperature: 6.5 },
      { time: "24:00", formattedTime: "Day 2, 00:00", temperature: baseTemp + 0.4, eventName: "CONTAINER_MOVED" },
    ];
  };

  const chartData = prepareChartData();
  const hasExcursion = chartData.some((d) => d.temperature > 8 || d.temperature < 2);

  return (
    <div
      className="card"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "1.25rem",
        marginBottom: "1.5rem",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={18} style={{ color: "var(--primary)" }} />
          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
            Cold-Chain Thermal Telemetry Stream
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.78rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span style={{ color: "var(--text-secondary)" }}>Safe Zone (2°C–8°C)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ color: "var(--text-secondary)" }}>Excursion Threshold</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={hasExcursion ? "#ef4444" : "#3b82f6"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={hasExcursion ? "#ef4444" : "#3b82f6"} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              stroke="var(--border-color)"
            />

            <YAxis
              domain={[-2, 14]}
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              stroke="var(--border-color)"
              unit="°C"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Cold Chain Safe Range Area (2°C to 8°C) */}
            <ReferenceArea y1={2} y2={8} fill="#10b981" fillOpacity={0.08} />

            {/* Threshold Lines */}
            <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Max 8°C", fill: "#ef4444", fontSize: 10, position: "top" }} />
            <ReferenceLine y={2} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: "Min 2°C", fill: "#3b82f6", fontSize: 10, position: "bottom" }} />

            {/* Area Line */}
            <Area
              type="monotone"
              dataKey="temperature"
              stroke={hasExcursion ? "#ef4444" : "#2563eb"}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tempGradient)"
              dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
            />

            {/* Render Event Dots on Timeline */}
            {chartData.map((d, index) =>
              d.eventName ? (
                <ReferenceDot
                  key={index}
                  x={d.time}
                  y={d.temperature}
                  r={6}
                  fill={d.temperature > 8 || d.temperature < 2 ? "#ef4444" : "#7c3aed"}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
