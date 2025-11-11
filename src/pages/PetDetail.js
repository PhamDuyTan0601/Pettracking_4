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
        setError("Không thể tải dữ liệu pet");
        console.error("Lỗi khi lấy dữ liệu pet:", err);
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
        <h2>Dữ Liệu Mới Nhất Của Pet</h2>

        {loading && <div className="loading">Đang tải...</div>}
        {error && <div className="error">{error}</div>}

        {data ? (
          <div className="pet-data">
            <p>
              <strong>Vĩ độ:</strong> {data.latitude}
            </p>
            <p>
              <strong>Kinh độ:</strong> {data.longitude}
            </p>
            <p>
              <strong>Tốc độ:</strong> {data.speed} m/s
            </p>
            <p>
              <strong>Hoạt động:</strong>
              <span className={`activity ${data.activityType}`}>
                {data.activityType}
              </span>
            </p>
            <p>
              <strong>Pin:</strong> {data.batteryLevel}%
            </p>
            <p>
              <strong>Cập nhật lúc:</strong>{" "}
              {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          !loading && <p>Không có dữ liệu cho pet này.</p>
        )}
      </div>
    </>
  );
}

export default PetDetail;
