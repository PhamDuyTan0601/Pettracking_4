import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const activityIcons = {
  resting: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  walking: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  running: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

export default function RealTimeMap({ petData, selectedPet }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [path, setPath] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    if (
      petData &&
      petData.length > 0 &&
      petData[0].latitude &&
      petData[0].longitude
    ) {
      const latestData = petData[0];
      const newPosition = [latestData.latitude, latestData.longitude];

      setCurrentPosition(newPosition);
      setPath((prev) => [...prev.slice(-50), newPosition]);

      if (mapRef.current) {
        mapRef.current.setView(newPosition, 16);
      }
    } else {
      const defaultPosition = [10.8231, 106.6297];
      setCurrentPosition(defaultPosition);
    }
  }, [petData]);

  if (!currentPosition) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
          background: "#f7fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #3182ce",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          ></div>
          <p style={{ marginTop: "16px", color: "#6b7280" }}>
            Đang chờ dữ liệu vị trí...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "400px", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={currentPosition}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {path.length > 1 && (
          <Polyline positions={path} color="#3B82F6" weight={4} opacity={0.7} />
        )}

        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={
              activityIcons[petData?.[0]?.activityType] || activityIcons.resting
            }
          >
            <Popup>
              <div style={{ fontSize: "14px" }}>
                <strong>{selectedPet?.name || "Pet"}</strong>
                <br />
                📍 {currentPosition[0].toFixed(6)},{" "}
                {currentPosition[1].toFixed(6)}
                <br />
                🏃 {petData?.[0]?.activityType || "unknown"}
                <br />⚡ {petData?.[0]?.batteryLevel || "N/A"}%
              </div>
            </Popup>
          </Marker>
        )}

        <CircleMarker
          center={currentPosition}
          radius={100}
          color="#10B981"
          fillColor="#10B981"
          fillOpacity={0.1}
          weight={2}
        />
      </MapContainer>
    </div>
  );
}
