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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center gap-4">
              <button onClick={() => setShowModal(false)}>
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-sm font-bold uppercase">
                Créer un hôtel
              </h2>
            </div>

            <form onSubmit={handleAddHotel} className="p-8 space-y-4">
              <input
                placeholder="Nom"
                required
                value={newHotel.name}
                onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
              />
              <input
                placeholder="Adresse"
                required
                value={newHotel.address}
                onChange={e => setNewHotel({ ...newHotel, address: e.target.value })}
              />
              <input
                placeholder="Prix"
                type="number"
                required
                value={newHotel.price}
                onChange={e => setNewHotel({ ...newHotel, price: e.target.value })}
              />
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
