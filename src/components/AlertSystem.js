import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AlertSystem({ petData, selectedPet }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (petData && petData.length > 0) {
      checkAlerts(petData[0]);
    }
  }, [petData]);

  const checkAlerts = (latestData) => {
    const newAlerts = [];

    if (latestData.batteryLevel < 20) {
      newAlerts.push({
        type: "battery",
        message: `Pin thấp: ${latestData.batteryLevel}%`,
        level: "warning",
      });
    }

    const safeZoneCenter = [10.8231, 106.6297];
    const distance = calculateDistance(
      safeZoneCenter[0],
      safeZoneCenter[1],
      latestData.latitude,
      latestData.longitude
    );

    if (distance > 0.5) {
      newAlerts.push({
        type: "location",
        message: "Pet ra khỏi vùng an toàn!",
        level: "danger",
      });
    }

    newAlerts.forEach((alert) => {
      if (
        !alerts.find(
          (a) => a.type === alert.type && a.message === alert.message
        )
      ) {
        toast[alert.level === "danger" ? "error" : "warning"](alert.message);
        setAlerts((prev) => [...prev, { ...alert, id: Date.now() }]);
      }
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        padding: "24px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "16px",
        }}
      >
        🚨 Thông báo
      </h2>

      {alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>✅</div>
          <p style={{ margin: 0 }}>Không có cảnh báo nào</p>
          <p style={{ margin: 0, fontSize: "14px" }}>Mọi thứ đều ổn định</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: "16px",
                borderRadius: "8px",
                borderLeft: `4px solid ${
                  alert.level === "danger" ? "#ef4444" : "#f59e0b"
                }`,
                backgroundColor:
                  alert.level === "danger" ? "#fef2f2" : "#fffbeb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontWeight: "600", margin: 0 }}>
                    {alert.message}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
