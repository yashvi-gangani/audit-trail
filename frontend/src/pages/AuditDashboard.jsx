import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Package,
  Truck,
  MapPin,
  Thermometer,
  X,
  Clock,
  AlertTriangle,
  Activity,
  Timer,
  Plus,
} from "lucide-react";
//
import useShipment from "../hooks/useShipment";
import EventTimeline from "../components/EventTimeline";
import SearchBar from "../components/SearchBar";
import StateScrubber from "../components/StateScrubber";
import TemperatureChart from "../components/TemperatureChart";
import { getShipmentStats, createShipment } from "../services/api";

const getStatusClass = (status) => {
  switch (status) {
    case "DELIVERED":
      return "status delivered";

    case "IN_TRANSIT":
      return "status transit";

    case "LOADED":
      return "status loaded";

    default:
      return "status";
  }
};

const getRiskClass = (riskLevel) => {
  switch (riskLevel) {
    case "HIGH":
      return "danger";

    case "MEDIUM":
      return "warning";

    default:
      return "success";
  }
};

const AuditDashboard = () => {
  const {
    shipments = [],
    selectedShipment,
    events,
    loading,
    detailsLoading,
    error,
    detailsError,
    refresh,
    selectShipment,
    clearSelection,
  } = useShipment();

  const [selectedId, setSelectedId] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    containerNumber: "",
    origin: "",
    destination: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccessMsg, setCreateSuccessMsg] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.containerNumber || !createForm.origin || !createForm.destination) return;

    try {
      setCreateLoading(true);
      const aggId = `SH-${Date.now().toString().slice(-6)}`;
      await createShipment({
        aggregateId: aggId,
        containerNumber: createForm.containerNumber,
        origin: createForm.origin,
        destination: createForm.destination,
      });
      setCreateSuccessMsg(`Shipment ${aggId} created successfully!`);
      setCreateForm({ containerNumber: "", origin: "", destination: "" });
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccessMsg("");
        refresh();
        fetchStats();
      }, 1000);
    } catch (err) {
      alert("Error creating shipment: " + err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    selectShipment(id);
  };

  const handleClearSelection = () => {
    setSelectedId(null);
    clearSelection();
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const response = await getShipmentStats();
      setStats(response.data || null);
    } catch (err) {
      setStatsError(
        err.message || "Failed to load shipment statistics",
      );
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formattedShipments = shipments.map((shipment) => ({
    id: shipment.aggregateId || shipment.id,
    name: shipment.containerNumber
      ? `Container ${shipment.containerNumber}`
      : shipment.name || shipment.aggregateId,
    status: shipment.status || "PENDING",
    destination: shipment.destination || "Destination N/A",
    origin: shipment.origin || "Origin N/A",
    currentTemp:
      shipment.temperature !== null &&
      shipment.temperature !== undefined
        ? `${shipment.temperature} °C`
        : "N/A",
  }));

  const totalShipments = stats?.total ?? shipments.length;

  const inTransit =
    stats?.inTransit ??
    shipments.filter(
      (shipment) => shipment.status === "IN_TRANSIT",
    ).length;

  const delivered =
    stats?.byStatus?.DELIVERED ??
    shipments.filter(
      (shipment) => shipment.status === "DELIVERED",
    ).length;

  const highRisk = stats?.byRisk?.HIGH ?? 0;

  const temperatureIssues = stats?.temperatureIssues ?? 0;

  const averageDuration =
    stats?.averageShipmentDurationHours ?? 0;

  return (
    <div
      className="dashboard"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "1.5rem",
      }}
    >
      {/* Header */}
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <p
            className="eyebrow"
            style={{
              fontSize: "0.75rem",
              color: "var(--primary)",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            AUDIT TRAIL
          </p>

          <h1
            style={{
              fontSize: "1.6rem",
              margin: "0.2rem 0",
            }}
          >
            Shipment Monitoring
          </h1>

          <p
            className="subtitle"
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              margin: 0,
            }}
          >
            Event-sourced logistics and audit ledger
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              background: "var(--primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 0 15px var(--primary-glow)",
            }}
          >
            <Plus size={17} /> Dispatch Shipment
          </button>

          <button
            className="refresh-button"
            onClick={() => {
              clearSelection();
              setSelectedId(null);
              refresh();
              fetchStats();
            }}
            disabled={loading || statsLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              cursor:
                loading || statsLoading
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading || statsLoading ? 0.7 : 1,
            }}
          >
            <RefreshCw
              size={17}
              style={{
                animation:
                  loading || statsLoading
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />

            {loading || statsLoading
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </header>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "1.75rem",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>Dispatch New Shipment</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                <X size={20} />
              </button>
            </div>

            {createSuccessMsg ? (
              <div style={{ background: "var(--success-glow)", border: "1px solid var(--success)", padding: "1rem", borderRadius: "var(--radius-sm)", color: "var(--success)", fontWeight: 600, textAlign: "center" }}>
                ✅ {createSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.3rem" }}>Container Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. C-9082"
                    value={createForm.containerNumber}
                    onChange={(e) => setCreateForm({ ...createForm, containerNumber: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.3rem" }}>Origin Hub</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Berlin Logistics Depot"
                    value={createForm.origin}
                    onChange={(e) => setCreateForm({ ...createForm, origin: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.3rem" }}>Destination Port</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Copenhagen Harbor"
                    value={createForm.destination}
                    onChange={(e) => setCreateForm({ ...createForm, destination: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: "0.6rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-primary)", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={createLoading} style={{ padding: "0.6rem 1.25rem", borderRadius: "var(--radius-sm)", border: "none", background: "var(--primary)", color: "#ffffff", fontWeight: 600, cursor: createLoading ? "not-allowed" : "pointer" }}>
                    {createLoading ? "Dispatching..." : "Dispatch & Append Event"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Shipment Error */}
      {error && (
        <div
          className="error"
          style={{
            background: "var(--danger-glow)",
            border: "1px solid var(--danger-border)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            color: "var(--danger)",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Analytics Error */}
      {statsError && (
        <div
          className="error"
          style={{
            background: "var(--danger-glow)",
            border: "1px solid var(--danger-border)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            color: "var(--danger)",
            marginBottom: "1.5rem",
          }}
        >
          {statsError}
        </div>
      )}

      {/* Statistics Grid */}
      <section
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Total Shipments */}
        <div
          className="stat-card card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <Package
            size={24}
            style={{ color: "var(--primary)" }}
          />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Total Shipments
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "1.25rem",
              }}
            >
              {statsLoading ? "—" : totalShipments}
            </strong>
          </div>
        </div>

        {/* In Transit */}
        <div
          className="stat-card card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <Truck
            size={24}
            style={{ color: "var(--info)" }}
          />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              In Transit
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "1.25rem",
              }}
            >
              {statsLoading ? "—" : inTransit}
            </strong>
          </div>
        </div>

        {/* Delivered */}
        <div
          className="stat-card card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <MapPin
            size={24}
            style={{ color: "var(--success)" }}
          />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Delivered
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "1.25rem",
              }}
            >
              {statsLoading ? "—" : delivered}
            </strong>
          </div>
        </div>

        {/* High Risk */}
        <div
          className="stat-card card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <AlertTriangle
            size={24}
            style={{ color: "var(--danger)" }}
          />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              High Risk
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "1.25rem",
              }}
            >
              {statsLoading ? "—" : highRisk}
            </strong>
          </div>
        </div>

        {/* Temperature Issues */}
        <div
          className="stat-card card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <Thermometer
            size={24}
            style={{ color: "var(--warning)" }}
          />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Temperature Issues
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "1.25rem",
              }}
            >
              {statsLoading ? "—" : temperatureIssues}
            </strong>
          </div>
        </div>

        {/* Average Duration */}
        <div
          className="stat-card card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <Timer
            size={24}
            style={{ color: "var(--primary)" }}
          />

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              Avg. Duration
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "1.25rem",
              }}
            >
              {statsLoading
                ? "—"
                : `${averageDuration}h`}
            </strong>
          </div>
        </div>
      </section>

      {/* Status Breakdown */}
      {stats && (
        <section
          className="card"
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.8rem",
            }}
          >
            <Activity size={18} />

            <strong>Shipment Status Overview</strong>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {Object.entries(stats.byStatus || {}).map(
              ([status, count]) => (
                <div
                  key={status}
                  style={{
                    padding: "0.55rem 0.8rem",
                    background: "var(--bg-secondary)",
                    border:
                      "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8rem",
                  }}
                >
                  <strong>{status}</strong>: {count}
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* Shipment Details */}
      {selectedShipment && (
        <section className="panel shipment-details">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                SHIPMENT DETAILS
              </p>

              <h2>
                {selectedShipment.containerNumber ||
                  "N/A"}
              </h2>

              <p>
                Aggregate ID:{" "}
                {selectedShipment.aggregateId}
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={handleClearSelection}
            >
              <X size={17} />
              Close
            </button>
          </div>

          {detailsLoading ? (
            <div className="empty">
              Loading shipment details...
            </div>
          ) : detailsError ? (
            <div className="error">
              {detailsError}
            </div>
          ) : (
            <>
              <div style={{ padding: "1.25rem 1.25rem 0 1.25rem" }}>
                <StateScrubber shipment={selectedShipment} events={events} />
                <TemperatureChart events={events} shipment={selectedShipment} />
              </div>

              <div className="details-grid">
                {/* Status */}
                <div className="detail-item">
                  <span>Status</span>

                  <strong>
                    <span
                      className={getStatusClass(
                        selectedShipment.status,
                      )}
                    >
                      {selectedShipment.status ||
                        "UNKNOWN"}
                    </span>
                  </strong>
                </div>

                {/* Route */}
                <div className="detail-item">
                  <span>Route</span>

                  <strong>
                    {selectedShipment.origin ||
                      "—"}{" "}
                    →{" "}
                    {selectedShipment.destination ||
                      "—"}
                  </strong>
                </div>

                {/* Vessel */}
                <div className="detail-item">
                  <span>Vessel</span>

                  <strong>
                    {selectedShipment.vessel || "—"}
                  </strong>
                </div>

                {/* Location */}
                <div className="detail-item">
                  <span>Current Location</span>

                  <strong>
                    {selectedShipment.currentLocation ||
                      "—"}
                  </strong>
                </div>

                {/* Temperature */}
                <div className="detail-item">
                  <span>Temperature</span>

                  <strong>
                    {selectedShipment.temperature !==
                      null &&
                    selectedShipment.temperature !==
                      undefined
                      ? `${selectedShipment.temperature} ${
                          selectedShipment.temperatureUnit ||
                          "°C"
                        }`
                      : "—"}
                  </strong>
                </div>

                {/* Last Event Version */}
                <div className="detail-item">
                  <span>Last Event Version</span>

                  <strong>
                    {selectedShipment.lastEventVersion ??
                      "—"}
                  </strong>
                </div>

                {/* Risk Level */}
                <div className="detail-item">
                  <span>Risk Level</span>

                  <strong>
                    <span
                      className={`status ${getRiskClass(
                        selectedShipment.risk?.riskLevel,
                      )}`}
                    >
                      {selectedShipment.risk
                        ?.riskLevel || "LOW"}
                    </span>
                  </strong>
                </div>

                {/* Risk Analysis */}
                <div
                  className="detail-item"
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <span>Risk Analysis</span>

                  <ul
                    style={{
                      margin: "0.5rem 0 0",
                      paddingLeft: "1.2rem",
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    {(
                      selectedShipment.risk
                        ?.reasons || [
                        "No known shipment anomalies detected",
                      ]
                    ).map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Event History */}
              <div className="history-section">
                <div className="history-header">
                  <div>
                    <h2>Event History</h2>

                    <p>
                      Immutable event stream for this
                      shipment
                    </p>
                  </div>

                  <Clock size={20} />
                </div>

                <EventTimeline
                  events={events}
                  loading={detailsLoading}
                />
              </div>
            </>
          )}
        </section>
      )}

      {/* Search + Shipment Ledger */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(280px, 320px) 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Search */}
        <aside
          className="card"
          style={{
            padding: "1rem",
            height: "600px",
          }}
        >
          <SearchBar
            shipments={formattedShipments}
            selectedId={selectedId}
            onSelect={handleSelect}
            loading={loading}
          />
        </aside>

        {/* Ledger Table */}
        <section
          className="panel card"
          style={{ padding: "1.25rem" }}
        >
          <div
            className="panel-header"
            style={{ marginBottom: "1rem" }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.1rem",
                  margin: 0,
                }}
              >
                Shipment Ledger Read Models
              </h2>

              <p
                style={{
                  fontSize: "0.8rem",
                  color:
                    "var(--text-secondary)",
                  margin: "0.2rem 0 0",
                }}
              >
                Current state calculated dynamically
                from event stream projections
              </p>
            </div>
          </div>

          {loading ? (
            <div
              className="empty"
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              Loading shipments...
            </div>
          ) : shipments.length === 0 ? (
            <div
              className="empty"
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              No shipments available.
            </div>
          ) : (
            <div
              className="table-wrapper"
              style={{ overflowX: "auto" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "0.85rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom:
                        "1px solid var(--border-color)",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                    }}
                  >
                    <th style={{ padding: "0.75rem" }}>
                      Container
                    </th>

                    <th style={{ padding: "0.75rem" }}>
                      Status
                    </th>

                    <th style={{ padding: "0.75rem" }}>
                      Route
                    </th>

                    <th style={{ padding: "0.75rem" }}>
                      Vessel
                    </th>

                    <th style={{ padding: "0.75rem" }}>
                      Location
                    </th>

                    <th style={{ padding: "0.75rem" }}>
                      Temperature
                    </th>

                    <th style={{ padding: "0.75rem" }}>
                      Risk
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {shipments.map((shipment) => {
                    const id =
                      shipment.aggregateId ||
                      shipment.id;

                    const isSelected =
                      id === selectedId;

                    const riskLevel =
                      shipment.risk?.riskLevel ||
                      "LOW";

                    return (
                      <tr
                        key={id}
                        onClick={() =>
                          handleSelect(id)
                        }
                        className="shipment-row"
                        style={{
                          borderBottom:
                            "1px solid var(--border-color)",
                          background: isSelected
                            ? "var(--bg-tertiary)"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {/* Container */}
                        <td
                          style={{
                            padding: "0.75rem",
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                            }}
                          >
                            {shipment.containerNumber ||
                              "N/A"}
                          </strong>

                          <small
                            className="code"
                            style={{
                              fontSize: "0.7rem",
                            }}
                          >
                            {id}
                          </small>
                        </td>

                        {/* Status */}
                        <td
                          style={{
                            padding: "0.75rem",
                          }}
                        >
                          <span
                            className={getStatusClass(
                              shipment.status,
                            )}
                          >
                            {shipment.status ||
                              "UNKNOWN"}
                          </span>
                        </td>

                        {/* Route */}
                        <td
                          style={{
                            padding: "0.75rem",
                          }}
                        >
                          {shipment.origin || "—"} →{" "}
                          {shipment.destination || "—"}
                        </td>

                        {/* Vessel */}
                        <td
                          style={{
                            padding: "0.75rem",
                          }}
                        >
                          {shipment.vessel || "—"}
                        </td>

                        {/* Location */}
                        <td
                          style={{
                            padding: "0.75rem",
                          }}
                        >
                          {shipment.currentLocation ||
                            "—"}
                        </td>

                        {/* Temperature */}
                        <td
                          style={{
                            padding: "0.75rem",
                            fontFamily:
                              "var(--font-mono)",
                          }}
                        >
                          {shipment.temperature !==
                            null &&
                          shipment.temperature !==
                            undefined
                            ? `${shipment.temperature} ${
                                shipment.temperatureUnit ||
                                "°C"
                              }`
                            : "—"}
                        </td>

                        {/* Risk */}
                        <td
                          style={{
                            padding: "0.75rem",
                          }}
                        >
                          <div>
                            <span
                              className={`status ${getRiskClass(
                                riskLevel,
                              )}`}
                            >
                              {riskLevel}
                            </span>

                            {shipment.risk?.reasons
                              ?.length > 0 && (
                              <small
                                style={{
                                  display: "block",
                                  marginTop: "0.35rem",
                                  color:
                                    "var(--text-secondary)",
                                  lineHeight: "1.4",
                                }}
                              >
                                {
                                  shipment.risk
                                    .reasons[0]
                                }
                              </small>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export { AuditDashboard };
export default AuditDashboard;

