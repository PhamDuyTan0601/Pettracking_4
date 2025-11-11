import React, { useEffect, useState } from "react";
import { getPetsByUser, getAllPetData, deletePet } from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import RealTimeMap from "../components/RealTimeMap";
import DashboardStats from "../components/DashboardStats";
import AlertSystem from "../components/AlertSystem";

function Dashboard() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petData, setPetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await getPetsByUser();
      const petsData = res.data.pets || [];
      setPets(petsData);

      if (petsData.length > 0) {
        setSelectedPet(petsData[0]);
        await fetchPetData(petsData[0]._id);
      }
    } catch (err) {
      console.error("Error loading pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPetData = async (petId) => {
    try {
      const res = await getAllPetData(petId);
      const data = res.data.data || [];
      setPetData(data);

      if (data.length === 0) {
        const sampleData = [
          {
            latitude: 10.8231,
            longitude: 106.6297,
            activityType: "walking",
            batteryLevel: 85,
            speed: 1.2,
            timestamp: new Date().toISOString(),
          },
        ];
        setPetData(sampleData);
      }
    } catch (err) {
      console.error("Error fetching pet data:", err);
      const sampleData = [
        {
          latitude: 10.8231,
          longitude: 106.6297,
          activityType: "walking",
          batteryLevel: 85,
          speed: 1.2,
          timestamp: new Date().toISOString(),
        },
      ];
      setPetData(sampleData);
    }
  };

  const handlePetSelect = async (pet) => {
    setSelectedPet(pet);
    await fetchPetData(pet._id);
  };

  const handleDeletePet = async (petId, petName) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa pet "${petName}"? Hành động này không thể hoàn tác.`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deletePet(petId);

      const updatedPets = pets.filter((pet) => pet._id !== petId);
      setPets(updatedPets);

      if (selectedPet && selectedPet._id === petId) {
        if (updatedPets.length > 0) {
          setSelectedPet(updatedPets[0]);
          await fetchPetData(updatedPets[0]._id);
        } else {
          setSelectedPet(null);
          setPetData([]);
        }
      }

      alert(`✅ Đã xóa pet "${petName}" thành công!`);
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert(
        "❌ Lỗi khi xóa pet: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h2>🐾 Dashboard Theo Dõi Pet</h2>
          <Link to="/add-pet">
            <button style={{ marginBottom: 0 }}>+ Thêm Pet Mới</button>
          </Link>
        </div>

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : pets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <p>Chưa có pet nào. Thêm pet đầu tiên của bạn!</p>
            <Link to="/add-pet">
              <button>Thêm Pet Đầu Tiên</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="pet-selector">
              <label>Chọn Pet để theo dõi:</label>
              <select
                value={selectedPet?._id || ""}
                onChange={(e) => {
                  const pet = pets.find((p) => p._id === e.target.value);
                  if (pet) handlePetSelect(pet);
                }}
              >
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} - {pet.species}
                  </option>
                ))}
              </select>
            </div>

            {selectedPet && (
              <>
                <DashboardStats petData={petData} selectedPet={selectedPet} />

                <div className="grid-layout">
                  <div className="map-section">
                    <h3>🗺️ Bản Đồ Theo Dõi Thời Gian Thực</h3>
                    <RealTimeMap petData={petData} selectedPet={selectedPet} />
                  </div>

                  <div className="alerts-section">
                    <AlertSystem petData={petData} selectedPet={selectedPet} />
                  </div>
                </div>

                <div
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3>📋 Danh Sách Pets Của Bạn</h3>
                  <div className="pets-grid">
                    {pets.map((pet) => (
                      <div
                        key={pet._id}
                        className={`pet-card ${
                          selectedPet?._id === pet._id ? "active" : ""
                        }`}
                      >
                        <div
                          className="pet-info"
                          onClick={() => handlePetSelect(pet)}
                          style={{ cursor: "pointer", flex: 1 }}
                        >
                          <h4 style={{ margin: "0 0 8px 0", color: "#2d3748" }}>
                            {pet.name}
                          </h4>
                          <p
                            style={{
                              margin: "4px 0",
                              color: "#718096",
                              fontSize: "14px",
                            }}
                          >
                            {pet.species} • {pet.breed}
                          </p>
                          <p
                            style={{
                              margin: "4px 0",
                              color: "#718096",
                              fontSize: "14px",
                            }}
                          >
                            {pet.age} tuổi
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "10px",
                              fontSize: "14px",
                            }}
                          >
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                background: "#48bb78",
                                borderRadius: "50%",
                              }}
                            ></span>
                            <span>Đang hoạt động</span>
                          </div>
                        </div>
                        <div className="pet-actions">
                          <button
                            onClick={() => handleDeletePet(pet._id, pet.name)}
                            disabled={deleting}
                            className="delete-btn"
                            title="Xóa pet"
                          >
                            {deleting ? "⏳" : "🗑️"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
