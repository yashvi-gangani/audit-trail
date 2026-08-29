import {
  RefreshCw,
  Package,
  Truck,
  MapPin,
  Thermometer,
} from "lucide-react";

import useShipment from "../hooks/useShipment";

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
    stats,
    loading,
    error,
    refresh,
  } = useShipment();

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <p className="eyebrow">AUDIT TRAIL</p>
          <h1>Shipment Monitoring</h1>
          <p className="subtitle">
            Event-sourced logistics and audit ledger
          </p>
        </div>

        <button className="refresh-button" onClick={refresh}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <Package size={22} />
          <div>
            <span>Total Shipments</span>
            <strong>{stats?.total ?? 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <Truck size={22} />
          <div>
            <span>In Transit</span>
            <strong>
              {stats?.byStatus?.find(
                (item) => item.status === "IN_TRANSIT"
              )?.count ?? 0}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <MapPin size={22} />
          <div>
            <span>Delivered</span>
            <strong>
              {stats?.byStatus?.find(
                (item) => item.status === "DELIVERED"
              )?.count ?? 0}
            </strong>
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

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Shipments</h2>
            <p>Current state from the shipment read model</p>
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
                  <tr key={shipment.aggregateId}>
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
    </div>
  );
};

export default AuditDashboard;