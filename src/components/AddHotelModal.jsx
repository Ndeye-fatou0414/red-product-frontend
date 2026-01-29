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
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
      {/* Header réduit */}
      <div className="px-6 py-4 border-b border-dashed flex items-center gap-4">
        <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-md font-semibold text-gray-700 uppercase tracking-wide">
          Créer un nouveau hôtel
        </h2>
      </div>

      {/* Formulaire plus compact */}
      <form onSubmit={handleAddHotel} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Nom de l'hôtel</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-gray-400"
              placeholder="CAP Mamiane"
              required
              value={newHotel.name}
              onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            />
          </div>

          {/* Adresse */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Adresse</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-gray-400"
              placeholder="Les îles du saloum"
              required
              value={newHotel.address}
              onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
            />
          </div>

          {/* E-mail */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">E-mail</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
              placeholder="hotel@mail.com"
              value={newHotel.email}
              onChange={(e) => setNewHotel({ ...newHotel, email: e.target.value })}
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Téléphone</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
              placeholder="+221..."
              value={newHotel.phone}
              onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })}
            />
          </div>

          {/* Prix */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Prix par nuit</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
              placeholder="XOF"
              required
              value={newHotel.price}
              onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
            />
          </div>

          {/* Devise */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Devise</label>
            <select className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none">
              <option>F XOF</option>
            </select>
          </div>
        </div>

        {/* Zone Image réduite (h-32 au lieu de h-48) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Photo</label>
          <div className="border-2 border-dashed border-gray-100 rounded-xl h-32 flex flex-col items-center justify-center relative hover:bg-gray-50 transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => setNewHotel({...newHotel, image: e.target.files[0]})}
            />
            <ImageIcon className="text-gray-300 mb-1" size={32} />
            <span className="text-gray-400 text-xs font-medium">Ajouter une photo</span>
            {newHotel.image && (
                <span className="mt-1 text-[10px] text-blue-600 font-bold truncate max-w-[200px]">{newHotel.image.name}</span>
            )}
          </div>
        </div>

        {/* Actions : Bouton Annuler ajouté */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            disabled={loading}
            type="submit"
            className="bg-[#4b4b4b] hover:bg-black text-white px-8 py-2 rounded-lg text-sm font-medium transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Chargement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </main>
  );
};

export default HotelsList;
