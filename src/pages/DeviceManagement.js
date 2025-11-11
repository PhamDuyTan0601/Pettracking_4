import React, { useState, useEffect } from "react";
import { getPetsByUser, registerDevice, getMyDevices } from "../api/api";
import Navbar from "../components/Navbar";

function DeviceManagement() {
  const [pets, setPets] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
    fetchDevices();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await getPetsByUser();
      setPets(res.data.pets || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await getMyDevices();
      setDevices(res.data.devices || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!deviceId || !selectedPet) {
      alert("Vui lòng nhập Device ID và chọn pet");
      return;
    }

    setLoading(true);
    try {
      await registerDevice(deviceId, selectedPet);
      alert("✅ Đăng ký device thành công!");
      setDeviceId("");
      setSelectedPet("");
      fetchDevices();
    } catch (error) {
      alert(
        "❌ Lỗi đăng ký device: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const generateDeviceId = () => {
    const newId =
      "ESP32_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setDeviceId(newId);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>📱 Quản lý Devices</h2>

        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>➕ Đăng ký Device Mới</h3>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "15px" }}>
              <label>Device ID:</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  placeholder="Nhập Device ID"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                  required
                />
                <button type="button" onClick={generateDeviceId}>
                  🎲 Tạo ID
                </button>
              </div>
              <small>Device ID từ ESP32 hoặc tạo mới</small>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Chọn Pet:</label>
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <option value="">-- Chọn pet --</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Đang đăng ký..." : "📝 Đăng ký Device"}
            </button>
          </form>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📋 Devices Đã Đăng Ký</h3>
          {devices.length === 0 ? (
            <p>Chưa có device nào được đăng ký</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {devices.map((device) => (
                <div
                  key={device._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    background: "#f7fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <strong>Device ID: {device.deviceId}</strong>
                    <div>
                      <span
                        style={{
                          background: "#3182ce",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          marginRight: "5px",
                        }}
                      >
                        Pet: {device.petId?.name}
                      </span>
                      <span
                        style={{
                          background: "#38a169",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {device.petId?.species}
                      </span>
                    </div>
                    <small>
                      Cập nhật: {new Date(device.lastSeen).toLocaleString()}
                    </small>
                  </div>
                  <div>
                    <span
                      style={{
                        color: device.isActive ? "#38a169" : "#e53e3e",
                        fontWeight: "bold",
                      }}
                    >
                      {device.isActive ? "🟢 Active" : "🔴 Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DeviceManagement;
