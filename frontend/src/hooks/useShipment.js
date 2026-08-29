import { useEffect, useState } from "react";
import {
  getShipments,
  getShipmentStats,
} from "../services/api";

const useShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [shipmentResponse, statsResponse] =
        await Promise.all([
          getShipments(),
          getShipmentStats(),
        ]);

      setShipments(shipmentResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    shipments,
    stats,
    loading,
    error,
    refresh: fetchData,
  };
};

export default useShipment;