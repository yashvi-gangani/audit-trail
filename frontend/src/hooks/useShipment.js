import { useEffect, useState } from "react";
import { getShipments } from "../services/api";

const useShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    shipments,
    loading,
    error,
    refresh: fetchData,
  };
};

export default useShipment;