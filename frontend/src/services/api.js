const API_BASE_URL = "http://localhost:5001/api";

export const getShipments = async () => {
  const response = await fetch(
    `${API_BASE_URL}/queries/shipments`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipments");
  }

  return response.json();
};

export const getShipmentById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/queries/shipments/${id}`
  );

  if (!response.ok) {
    throw new Error("Shipment not found");
  }

  return response.json();
};

export const getShipmentHistory = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/queries/shipments/${id}/history`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment history");
  }

  return response.json();
};

export const getShipmentStats = async () => {
  const response = await fetch(
    `${API_BASE_URL}/queries/shipments/stats`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment statistics");
  }

  return response.json();
};

export const getShipmentReplay = async (id, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/queries/shipments/${id}/replay${query ? `?${query}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to replay shipment state");
  }

  return response.json();
};

export const createShipment = async (shipmentData) => {
  const response = await fetch(`${API_BASE_URL}/commands/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shipmentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create shipment");
  }

  return response.json();
};