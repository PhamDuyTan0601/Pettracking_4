import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AlertSystem({ petData, selectedPet }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (petData && petData.length > 0) {
      checkAlerts(petData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petData]);

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

  const checkAlerts = (latestData) => {
    const newAlerts = [];

    // Kiểm tra pin yếu
    if (latestData.batteryLevel < 20) {
      newAlerts.push({
        type: "battery",
        message: `Pin thấp: ${latestData.batteryLevel}%`,
        level: "warning",
      });
    }

    // Kiểm tra ra khỏi vùng an toàn
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

    // Hiển thị alert mới
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

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="alerts-container">
      <h2 className="alerts-title">🚨 Thông báo</h2>

      {alerts.length === 0 ? (
        <div className="no-alerts">
          <div className="no-alerts-icon">✅</div>
          <p>Không có cảnh báo nào</p>
          <p className="no-alerts-sub">Mọi thứ đều ổn định</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.level}`}>
              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                <p className="alert-time">{new Date().toLocaleTimeString()}</p>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="alert-close"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
