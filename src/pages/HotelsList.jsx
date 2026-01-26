import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, X, Camera, ArrowLeft, Image as ImageIcon } from 'lucide-react';
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
      const response = await axios.get("http://127.0.0.1:8000/api/hotels/", {
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
    formData.append('location', newHotel.address);
    formData.append('email', newHotel.email);
    formData.append('phone_number', newHotel.phone);
    formData.append('price_per_night', newHotel.price);
    if (newHotel.image) formData.append('image', newHotel.image);

    try {
      await axios.post("http://127.0.0.1:8000/api/hotels/", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setShowModal(false);
      setNewHotel({ name: '', address: '', email: '', phone: '', price: '', image: null });
      fetchHotels();
    } catch (err) {
      // Gestion de l'erreur visible sur vos images
      const errorMsg = err.response?.data?.messages?.[0]?.message || "Erreur d'enregistrement";
      alert(`Erreur : ${errorMsg}`);
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
                <img src={h.image || "placeholder.png"} className="w-full h-40 object-cover" alt={h.name} />
                <button onClick={() => {/* Logique delete */}} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <Trash size={14} />
                </button>
             </div>
             <div className="p-4">
                <p className="text-[10px] text-yellow-600 font-bold uppercase">{h.location}</p>
                <h3 className="font-bold text-gray-800 text-sm truncate">{h.name}</h3>
                <p className="text-xs text-gray-500">{h.price_per_night} XOF / nuit</p>
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
                  <label className="text-xs font-medium text-gray-500">E-mail</label>
                  <input type="email" required className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.email} onChange={(e) => setNewHotel({...newHotel, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Numéro de téléphone</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.phone} onChange={(e) => setNewHotel({...newHotel, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Prix par nuit</label>
                  <input type="number" required className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-gray-500"
                    value={newHotel.price} onChange={(e) => setNewHotel({...newHotel, price: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Devise</label>
                  <select className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white">
                    <option>F XOF</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <label className="text-xs font-medium text-gray-500">Ajouter une photo</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setNewHotel({...newHotel, image: e.target.files[0]})} />
                  <ImageIcon size={32} strokeWidth={1} />
                  <span className="text-sm mt-2">{newHotel.image ? newHotel.image.name : "Ajouter une photo"}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={loading} className="bg-[#4a4a4a] text-white px-10 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition disabled:opacity-50">
                  {loading ? "Envoi..." : "Enregistrer"}
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