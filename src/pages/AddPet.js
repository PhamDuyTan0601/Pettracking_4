import React, { useState } from "react";
import { addPet } from "../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddPet() {
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPet(form);
      alert("✅ Thêm pet thành công!");
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Lỗi khi thêm pet. Vui lòng thử lại.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Thêm Pet Mới</h2>
        <form onSubmit={handleSubmit} className="pet-form">
          <input
            placeholder="Tên Pet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={loading}
          />
          <input
            placeholder="Loài (chó, mèo, chim, ...)"
            value={form.species}
            onChange={(e) => setForm({ ...form, species: e.target.value })}
            required
            disabled={loading}
          />
          <input
            placeholder="Giống"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            required
            disabled={loading}
          />
          <input
            placeholder="Tuổi (năm)"
            type="number"
            min="0"
            max="50"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm Pet"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddPet;
