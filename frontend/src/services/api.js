const API_BASE_URL = "http://localhost:5001/api";

export const getShipments = async () => {
  const response = await fetch(`${API_BASE_URL}/queries/shipments`);

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