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
    loading,
    detailsLoading,
    error,
    detailsError,
    refresh,
    selectShipment,
    clearSelection,
  } = useShipment();

  const totalShipments = shipments.length;

  const inTransit = shipments.filter(
    (shipment) => shipment.status === "IN_TRANSIT"
  ).length;

  const delivered = shipments.filter(
    (shipment) => shipment.status === "DELIVERED"
  ).length;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div>
          <p className="eyebrow">AUDIT TRAIL</p>

          <h1>Shipment Monitoring</h1>

          <p className="subtitle">
            Event-sourced logistics and audit ledger
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw size={17} />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <Package size={22} />

          <div>
            <span>Total Shipments</span>
            <strong>{totalShipments}</strong>
          </div>
        </div>

        <div className="stat-card">
          <Truck size={22} />

          <div>
            <span>In Transit</span>
            <strong>{inTransit}</strong>
          </div>
        </div>

        <div className="stat-card">
          <MapPin size={22} />

          <div>
            <span>Delivered</span>
            <strong>{delivered}</strong>
          </div>
        </div>

        <div className="stat-card">
          <Thermometer size={22} />

          <div>
            <span>Tracked Shipments</span>
            <strong>{shipments.length}</strong>
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
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AuditDashboard;