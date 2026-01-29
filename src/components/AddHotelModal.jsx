import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ArrowLeft } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";

const HotelsList = () => {
  const [searchTerm] = useOutletContext() || [""];
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    price: "",
    email: "",
    phone: "",
    image: null, // UI only
  });

  /* ================= FETCH HOTELS ================= */
  const fetchHotels = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        "https://mon-projet-django-b8xs.onrender.com/api/hotels/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHotels(response.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("price_per_night", parseFloat(formData.price));
    if (formData.email) data.append("email", formData.email);
    if (formData.phone) data.append("phone", formData.phone);
    // ❌ image n'est pas envoyé car backend ne l'accepte pas

    try {
      await axios.post(
        "https://mon-projet-django-b8xs.onrender.com/api/hotels/",
        data,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      alert("Hôtel ajouté avec succès !");
      setShowModal(false);
      setFormData({
        name: "",
        address: "",
        price: "",
        email: "",
        phone: "",
        image: null,
      });
      fetchHotels();
    } catch (err) {
      console.error("ERREUR BACKEND :", err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE URL ================= */
  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x300?text=Pas+d'image";
    if (typeof image === "string" && image.startsWith("http")) return image;
    return "https://via.placeholder.com/400x300?text=Image";
  };

  /* ================= RENDER ================= */
  return (
    <main className="flex-1 min-h-screen bg-[#f8f9fa]">
      <header className="h-16 bg-white border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Hôtels</h1>
          <span className="text-gray-400 text-sm">{hotels.length}</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm"
        >
          <Plus size={18} /> Créer un hôtel
        </button>
      </header>

      {/* ================= LISTE DES HÔTELS ================= */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((h) => (
          <div key={h.id} className="bg-white rounded-xl shadow-sm border">
            <img
              src={getImageUrl(h.image)}
              className="w-full h-40 object-cover"
              alt={h.name}
            />
            <div className="p-4">
              <p className="text-xs text-yellow-600 uppercase">{h.address}</p>
              <h3 className="font-bold text-sm truncate">{h.name}</h3>
              <p className="text-xs text-gray-500">{h.price_per_night} XOF / nuit</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center gap-4">
              <button onClick={() => setShowModal(false)}>
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-sm font-bold uppercase">Créer un hôtel</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <input
                placeholder="Nom"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                placeholder="Adresse"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <input
                placeholder="Prix"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <input
                placeholder="E-mail (optionnel)"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                placeholder="Téléphone (optionnel)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {/* ❌ Image conservée côté UI uniquement */}
              {formData.image && (
                <p className="text-xs text-gray-500">
                  Image sélectionnée : {formData.image.name}
                </p>
              )}

              <button
                disabled={loading}
                type="submit"
                className="bg-black text-white px-6 py-2 rounded"
              >
                {loading ? "Chargement..." : "Enregistrer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default HotelsList;
