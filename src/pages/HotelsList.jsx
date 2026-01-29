import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const HotelsList = () => {
  const [searchTerm] = useOutletContext() || [""];
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    price: '',
    image: null // conservé pour l’UI uniquement
  });

  /* ================= FETCH ================= */
  const fetchHotels = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(
        "https://mon-projet-django-b8xs.onrender.com/api/hotels/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHotels(response.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  /* ================= CREATE ================= */
  const handleAddHotel = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('access_token');
    const formData = new FormData();

    // ✅ CHAMPS EXACTS ATTENDUS PAR LE BACKEND
    formData.append('name', newHotel.name);
    formData.append('address', newHotel.address);
    formData.append(
      'price_per_night',
      parseFloat(newHotel.price)
    );

    if (newHotel.email) formData.append('email', newHotel.email);
    if (newHotel.phone) formData.append('phone', newHotel.phone);

    // ❌ NE PAS envoyer l’image (lecture seule côté backend)

    try {
      await axios.post(
        "https://mon-projet-django-b8xs.onrender.com/api/hotels/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setShowModal(false);
      setNewHotel({
        name: '',
        address: '',
        email: '',
        phone: '',
        price: '',
        image: null
      });

      fetchHotels();
    } catch (err) {
      console.error("❌ Erreur:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE ================= */
  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x300?text=Pas+d'image";
    if (typeof image === 'string' && image.startsWith('http')) return image;
    return "https://via.placeholder.com/400x300?text=Image";
  };

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

      {/* ================= LIST ================= */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map(h => (
          <div key={h.id} className="bg-white rounded-xl shadow-sm border">
            <img
              src={getImageUrl(h.image)}
              className="w-full h-40 object-cover"
              alt={h.name}
            />
            <div className="p-4">
              <p className="text-xs text-yellow-600 uppercase">{h.address}</p>
              <h3 className="font-bold text-sm truncate">{h.name}</h3>
              <p className="text-xs text-gray-500">
                {h.price_per_night} XOF / nuit
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
     {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-dashed flex items-center gap-4">
        <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wide">
          Créer un nouveau hôtel
        </h2>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleAddHotel} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Nom de l'hôtel</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="CAP Mamiane"
              required
              value={newHotel.name}
              onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            />
          </div>

          {/* Adresse */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Adresse</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Les îles du saloum, Mar Lodj"
              required
              value={newHotel.address}
              onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
            />
          </div>

          {/* E-mail */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">E-mail</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="information@gmail.com"
              value={newHotel.email}
              onChange={(e) => setNewHotel({ ...newHotel, email: e.target.value })}
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Numéro de téléphone</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="+221 77 777 77 77"
              value={newHotel.phone}
              onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })}
            />
          </div>

          {/* Prix */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Prix par nuit</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="25.000 XOF"
              required
              value={newHotel.price}
              onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
            />
          </div>

          {/* Devise (Statique comme sur l'image) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Devise</label>
            <select className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-white outline-none">
              <option>F XOF</option>
            </select>
          </div>
        </div>

        {/* Zone Image */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Ajouter une photo</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center relative hover:bg-gray-50 transition-colors">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => setNewHotel({...newHotel, image: e.target.files[0]})}
            />
            <ImageIcon className="text-gray-300 mb-2" size={48} />
            <span className="text-gray-400 text-sm">Ajouter une photo</span>
            {newHotel.image && (
                <span className="mt-2 text-xs text-green-600 font-medium">{newHotel.image.name}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            disabled={loading}
            type="submit"
            className="bg-[#555555] hover:bg-[#444444] text-white px-10 py-3 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
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
