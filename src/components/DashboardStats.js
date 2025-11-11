import { useState, useEffect } from "react";

export default function DashboardStats({ petData, selectedPet }) {
  const [stats, setStats] = useState({
    batteryLevel: 0,
    activityType: "unknown",
  });

  useEffect(() => {
    if (petData && petData.length > 0) {
      setStats({
        batteryLevel: petData[0]?.batteryLevel || 0,
        activityType: petData[0]?.activityType || "unknown",
      });
    }
  }, [petData]);

  const ActivityBadge = ({ activityType }) => {
    const activityConfig = {
      resting: {
        color: "bg-green-100 text-green-800",
        icon: "🛌",
        label: "Nghỉ ngơi",
      },
      walking: {
        color: "bg-blue-100 text-blue-800",
        icon: "🚶",
        label: "Đang đi",
      },
      running: {
        color: "bg-red-100 text-red-800",
        icon: "🏃",
        label: "Đang chạy",
      },
      unknown: {
        color: "bg-gray-100 text-gray-800",
        icon: "❓",
        label: "Không xác định",
      },
    };

    const config = activityConfig[activityType] || activityConfig.unknown;

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 12px",
          borderRadius: "9999px",
          fontSize: "14px",
          fontWeight: "500",
          backgroundColor: config.color.includes("green")
            ? "#dcfce7"
            : config.color.includes("blue")
            ? "#dbeafe"
            : config.color.includes("red")
            ? "#fee2e2"
            : "#f3f4f6",
          color: config.color.includes("green")
            ? "#166534"
            : config.color.includes("blue")
            ? "#1e40af"
            : config.color.includes("red")
            ? "#991b1b"
            : "#374151",
        }}
      >
        <span style={{ marginRight: "8px" }}>{config.icon}</span>
        {config.label}
      </div>
    );
  };

  const StatCard = ({ title, value, unit, icon, color }) => (
    <div
      style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ fontSize: "24px", marginRight: "16px" }}>{icon}</div>
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#6b7280",
              margin: 0,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              margin: 0,
            }}
          >
            {value}{" "}
            {unit && (
              <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
        marginBottom: "24px",
      }}
    >
      <StatCard
        title="Mức pin"
        value={stats.batteryLevel}
        unit="%"
        icon="🔋"
        color="#f59e0b"
      />

      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          borderLeft: "4px solid #8b5cf6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: "24px", marginRight: "16px" }}>📊</div>
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#6b7280",
                margin: 0,
              }}
            >
              Trạng thái
            </h3>
            <div style={{ marginTop: "8px" }}>
              <ActivityBadge activityType={stats.activityType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
