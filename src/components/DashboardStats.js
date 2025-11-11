import React, { useState, useEffect } from "react";

export default function DashboardStats({ petData, selectedPet }) {
  const [stats, setStats] = useState({
    batteryLevel: 0,
    lastUpdate: null,
    activityType: "unknown",
  });

  useEffect(() => {
    if (petData && petData.length > 0) {
      setStats({
        batteryLevel: data[0]?.batteryLevel || 0,
        lastUpdate: data[0]?.timestamp,
        activityType: data[0]?.activityType || "unknown",
      });
    }
  }, [petData]);

  const ActivityBadge = ({ activityType }) => {
    const activityConfig = {
      resting: {
        color: "status-badge resting",
        icon: "🛌",
        label: "Nghỉ ngơi",
      },
      walking: {
        color: "status-badge walking",
        icon: "🚶",
        label: "Đang đi",
      },
      running: {
        color: "status-badge running",
        icon: "🏃",
        label: "Đang chạy",
      },
      playing: {
        color: "status-badge playing",
        icon: "🎾",
        label: "Đang chơi",
      },
      unknown: {
        color: "status-badge unknown",
        icon: "❓",
        label: "Không xác định",
      },
    };

    const config = activityConfig[activityType] || activityConfig.unknown;

    return (
      <div className={config.color}>
        <span className="status-icon">{config.icon}</span>
        {config.label}
      </div>
    );
  };

  return (
    <div className="stats-grid">
      <div className="stat-card battery">
        <div className="stat-icon">🔋</div>
        <div className="stat-info">
          <h3>Mức pin</h3>
          <p className="stat-value">{stats.batteryLevel}%</p>
        </div>
      </div>

      <div className="stat-card activity">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <h3>Trạng thái</h3>
          <div className="stat-value">
            <ActivityBadge activityType={stats.activityType} />
          </div>
        </div>
      </div>
    </div>
  );
}
