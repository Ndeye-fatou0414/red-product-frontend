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
    image: null
  });

  const fetchHotels = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get("https://mon-projet-django-b8xs.onrender.com/api/hotels/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(response.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token');

    const formData = new FormData();
    formData.append('name', newHotel.name);
    formData.append('address', newHotel.address);
    formData.append('price', parseFloat(newHotel.price).toFixed(2)); // ✅ format décimal

    if (newHotel.email) formData.append('email', newHotel.email);
    if (newHotel.phone) formData.append('phone', newHotel.phone);
    if (newHotel.image) formData.append('image', newHotel.image);

    try {
      await axios.post("https://mon-projet-django-b8xs.onrender.com/api/hotels/", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setShowModal(false);
      setNewHotel({ name: '', address: '', email: '', phone: '', price: '', image: null });
      fetchHotels();
    } catch (err) {
      console.error("Erreur complète:", err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2)); // ✅ affiche l'erreur exacte
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#f8f9fa]">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium text-gray-800">Hôtels</h1>
          <span className="text-gray-400 text-sm">{hotels.length}</span>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          <Plus size={18} /> Créer un nouveau hôtel
        </button>
      </header>

      {/* Grille d'hôtels */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((h) => (
          <div key={h.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
             <div className="relative">
                <img 
  src={h.image || "https://via.placeholder.com/400x300?text=Pas+d'image"} 
  className="w-full h-40 object-cover" 
  alt={h.name}
  onError={(e) => {
    console.log("Erreur image pour:", h.name, "URL:", h.image);
    e.target.src = "https://via.placeholder.com/400x300?text=Erreur";
  }}
/>
                <button onClick={() => {/* Logique delete */}} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <Trash size={14} />
                </button>
             </div>
             <div className="p-4">
                <p className="text-[10px] text-yellow-600 font-bold uppercase">{h.address}</p> {/* ✅ correction */}
                <h3 className="font-bold text-gray-800 text-sm truncate">{h.name}</h3>
                <p className="text-xs text-gray-500">{h.price} XOF / nuit</p> {/* ✅ correction */}
             </div>
          </div>
        ))}
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-4 border-b border-dotted border-gray-300">
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-sm font-bold text-gray-700 uppercase">Créer un nouveau hôtel</h2>
            </div>

            <form onSubmit={handleAddHotel} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Nom de l'hôtel</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.name} onChange={(e) => setNewHotel({...newHotel, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Adresse</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.address} onChange={(e) => setNewHotel({...newHotel, address: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">E-mail (optionnel)</label>
                  <input type="email" className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.email} onChange={(e) => setNewHotel({...newHotel, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Numéro de téléphone (optionnel)</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.phone} onChange={(e) => setNewHotel({...newHotel, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Prix par nuit</label>
                  <input type="number" required className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.price} onChange={(e) => setNewHotel({...newHotel, price: e.target.value})} />
                </div>
              </div>

              {/* ... fin des inputs ... */}
<div className="mt-6 space-y-1">
  <label className="text-xs font-medium text-gray-500">Ajouter une photo (optionnel)</label>
  <div className="relative border-2 border-dashed border-gray-200 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer">
    <input 
      type="file" 
      accept="image/*" 
      className="absolute inset-0 opacity-0 cursor-pointer" 
      onChange={(e) => setNewHotel({...newHotel, image: e.target.files[0]})} 
    />
    <ImageIcon size={32} strokeWidth={1} />
    <span className="text-sm mt-2">{newHotel.image ? newHotel.image.name : "Ajouter une photo"}</span>
  </div>
</div>

{/* BOUTON ALIGNÉ À DROITE */}
<div className="mt-8 flex justify-end">
  <button 
    type="submit" 
    disabled={loading}
    className={`bg-[#4a4d50] text-white px-10 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
    }`}
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