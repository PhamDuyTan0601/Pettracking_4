import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLatestPetData } from "../api/api";
import Navbar from "../components/Navbar";

function PetDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getLatestPetData(id);
        setData(res.data.data);
        setError("");
      } catch (err) {
        setError("Failed to load pet data");
        console.error("Error fetching pet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Pet Latest Data</h2>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {data ? (
          <div
            style={{
              background: "#f7fafc",
              padding: "20px",
              borderRadius: "10px",
              borderLeft: "4px solid #3182ce",
            }}
          >
            <p
              style={{
                margin: "10px 0",
                padding: "8px",
                background: "white",
                borderRadius: "6px",
              }}
            >
              <strong>Latitude:</strong> {data.latitude}
            </p>
            <p
              style={{
                margin: "10px 0",
                padding: "8px",
                background: "white",
                borderRadius: "6px",
              }}
            >
              <strong>Longitude:</strong> {data.longitude}
            </p>
            <p
              style={{
                margin: "10px 0",
                padding: "8px",
                background: "white",
                borderRadius: "6px",
              }}
            >
              <strong>Speed:</strong> {data.speed} m/s
            </p>
            <p
              style={{
                margin: "10px 0",
                padding: "8px",
                background: "white",
                borderRadius: "6px",
              }}
            >
              <strong>Activity:</strong> {data.activityType}
            </p>
            <p
              style={{
                margin: "10px 0",
                padding: "8px",
                background: "white",
                borderRadius: "6px",
              }}
            >
              <strong>Battery:</strong> {data.batteryLevel}%
            </p>
            <p
              style={{
                margin: "10px 0",
                padding: "8px",
                background: "white",
                borderRadius: "6px",
              }}
            >
              <strong>Last Updated:</strong>{" "}
              {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          !loading && <p>No data available for this pet.</p>
        )}
      </div>
    </>
  );
}

export default PetDetail;
