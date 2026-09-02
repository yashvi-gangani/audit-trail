import { useEffect, useState } from "react";

import {
  getShipments,
  getShipmentById,
  getShipmentHistory,
} from "../services/api";

const useShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getShipments();

      setShipments(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  const selectShipment = async (aggregateId) => {
    try {
      setDetailsLoading(true);
      setDetailsError("");

      const [shipmentResponse, historyResponse] =
        await Promise.all([
          getShipmentById(aggregateId),
          getShipmentHistory(aggregateId),
        ]);

      setSelectedShipment(shipmentResponse.data || null);
      setEvents(historyResponse.data || []);
    } catch (err) {
      setDetailsError(
        err.message || "Failed to load shipment details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedShipment(null);
    setEvents([]);
    setDetailsError("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    shipments,
    selectedShipment,
    events,

    loading,
    detailsLoading,

    error,
    detailsError,

    refresh: fetchData,
    selectShipment,
    clearSelection,
  };
};

export default useShipment;