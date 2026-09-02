import React, { useState } from "react";
import {
  RefreshCw,
  Package,
  Truck,
  MapPin,
  Thermometer,
  X,
  Clock,
} from "lucide-react";

import useShipment from "../hooks/useShipment";
import EventTimeline from "../components/EventTimeline";
import SearchBar from "../components/SearchBar";

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

const AuditDashboard = () => {
  const {
    shipments,
    selectedShipment,
    events,
    shipments = [],
    loading,
    detailsLoading,
    error,
    detailsError,
    refresh,
    selectShipment,
    clearSelection,
  } = useShipment();

  const [selectedId, setSelectedId] = useState(null);

  // Map shipments into SearchBar compatible format
  const formattedShipments = shipments.map(s => ({
    id: s.aggregateId || s.id,
    name: s.containerNumber ? `Container ${s.containerNumber}` : (s.name || s.aggregateId),
    status: s.status || "PENDING",
    destination: s.destination || "Destination N/A",
    origin: s.origin || "Origin N/A",
    currentTemp: s.temperature ? `${s.temperature} °C` : "N/A"
  }));

  const totalShipments = shipments.length;

  const inTransit = shipments.filter(
    (shipment) => shipment.status === "IN_TRANSIT"
  ).length;

  const delivered = shipments.filter(
    (shipment) => shipment.status === "DELIVERED"
  ).length;

  return (
    <div className="dashboard" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <p className="eyebrow" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>AUDIT TRAIL</p>
          <h1 style={{ fontSize: '1.6rem', margin: '0.2rem 0' }}>Shipment Monitoring</h1>
          <p className="subtitle" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Event-sourced logistics and audit ledger
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={refresh}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={17} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* Error */}
      {error && <div className="error">{error}</div>}
      {error && (
        <div className="error" style={{ background: 'var(--danger-glow)', border: '1px solid var(--danger-border)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Statistics Grid */}
      <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <Package size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Shipments</span>
            <strong style={{ display: 'block', fontSize: '1.25rem' }}>{totalShipments}</strong>
          </div>
        </div>

        <div className="stat-card card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <Truck size={24} style={{ color: 'var(--info)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>In Transit</span>
            <strong style={{ display: 'block', fontSize: '1.25rem' }}>{inTransit}</strong>
          </div>
        </div>

        <div className="stat-card card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <MapPin size={24} style={{ color: 'var(--success)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Delivered</span>
            <strong style={{ display: 'block', fontSize: '1.25rem' }}>{delivered}</strong>
          </div>
        </div>

        <div className="stat-card card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <Thermometer size={24} style={{ color: 'var(--warning)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tracked Sensors</span>
            <strong style={{ display: 'block', fontSize: '1.25rem' }}>{shipments.length}</strong>
          </div>
        </div>
      </section>

      {/* Shipment Details */}
      {selectedShipment && (
        <section className="panel shipment-details">
          <div className="panel-header">
            <div>
              <p className="eyebrow">SHIPMENT DETAILS</p>

              <h2>
                {selectedShipment.containerNumber || "N/A"}
              </h2>

              <p>
                Aggregate ID: {selectedShipment.aggregateId}
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={clearSelection}
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
              <div className="details-grid">
                <div className="detail-item">
                  <span>Status</span>

                  <strong>
                    <span
                      className={getStatusClass(
                        selectedShipment.status
                      )}
                    >
                      {selectedShipment.status || "UNKNOWN"}
                    </span>
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Route</span>

                  <strong>
                    {selectedShipment.origin || "—"} →{" "}
                    {selectedShipment.destination || "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Vessel</span>

                  <strong>
                    {selectedShipment.vessel || "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Current Location</span>

                  <strong>
                    {selectedShipment.currentLocation || "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Temperature</span>

                  <strong>
                    {selectedShipment.temperature !== null &&
                    selectedShipment.temperature !== undefined
                      ? `${selectedShipment.temperature} ${
                          selectedShipment.temperatureUnit || ""
                        }`
                      : "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Last Event Version</span>

                  <strong>
                    {selectedShipment.lastEventVersion ?? "—"}
                  </strong>
                </div>
              </div>

              {/* Event History */}
              <div className="history-section">
                <div className="history-header">
                  <div>
                    <h2>Event History</h2>

                    <p>
                      Immutable event stream for this shipment
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

      {/* Shipment Table */}
      {!selectedShipment && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Shipments</h2>

              <p>
                Current state from the shipment read model
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty">
              Loading shipments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="empty">
              No shipments available.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Container</th>
                    <th>Status</th>
                    <th>Route</th>
                    <th>Vessel</th>
                    <th>Location</th>
                    <th>Temperature</th>
      {/* Side-by-Side Dashboard Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: SearchBar Sidebar Component */}
        <aside className="card" style={{ padding: '1rem', height: '600px' }}>
          <SearchBar 
            shipments={formattedShipments}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={loading}
          />
        </aside>

        {/* Right Column: Shipment Details Table Panel */}
        <section className="panel card" style={{ padding: '1.25rem' }}>
          <div className="panel-header" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Shipment Ledger Read Models</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Current state calculated dynamically from event stream projections
            </p>
          </div>

          {loading ? (
            <div className="empty" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading shipments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="empty" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No shipments available.
            </div>
          ) : (
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    <th style={{ padding: '0.75rem' }}>Container</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Route</th>
                    <th style={{ padding: '0.75rem' }}>Vessel</th>
                    <th style={{ padding: '0.75rem' }}>Location</th>
                    <th style={{ padding: '0.75rem' }}>Temperature</th>
                  </tr>
                </thead>

                <tbody>
                  {shipments.map((shipment) => (
                    <tr
                      key={shipment.aggregateId}
                      onClick={() =>
                        selectShipment(shipment.aggregateId)
                      }
                      className="shipment-row"
                    >
                      <td>
                        <strong>
                          {shipment.containerNumber || "N/A"}
                        </strong>

                        <small>
                          {shipment.aggregateId}
                        </small>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            shipment.status
                          )}
                        >
                          {shipment.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td>
                        {shipment.origin || "—"} →{" "}
                        {shipment.destination || "—"}
                      </td>

                      <td>
                        {shipment.vessel || "—"}
                      </td>

                      <td>
                        {shipment.currentLocation || "—"}
                      </td>

                      <td>
                        {shipment.temperature !== null &&
                        shipment.temperature !== undefined
                          ? `${shipment.temperature} ${
                              shipment.temperatureUnit || ""
                            }`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {shipments
                    .filter(s => !selectedId || (s.aggregateId || s.id) === selectedId)
                    .map((shipment) => {
                      const id = shipment.aggregateId || shipment.id;
                      const isSelected = id === selectedId;
                      return (
                        <tr 
                          key={id} 
                          onClick={() => setSelectedId(id)}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          <td style={{ padding: '0.75rem' }}>
                            <strong style={{ display: 'block' }}>
                              {shipment.containerNumber || "N/A"}
                            </strong>
                            <small className="code" style={{ fontSize: '0.7rem' }}>
                              {id}
                            </small>
                          </td>

                          <td style={{ padding: '0.75rem' }}>
                            <span className={getStatusClass(shipment.status)}>
                              {shipment.status || "UNKNOWN"}
                            </span>
                          </td>

                          <td style={{ padding: '0.75rem' }}>
                            {shipment.origin || "—"} → {shipment.destination || "—"}
                          </td>

                          <td style={{ padding: '0.75rem' }}>
                            {shipment.vessel || "—"}
                          </td>

                          <td style={{ padding: '0.75rem' }}>
                            {shipment.currentLocation || "—"}
                          </td>

                          <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                            {shipment.temperature !== null && shipment.temperature !== undefined
                              ? `${shipment.temperature} ${shipment.temperatureUnit || "°C"}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      </div>
    </div>
  );
};

export { AuditDashboard };
export default AuditDashboard;