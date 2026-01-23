import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, X, Camera } from 'lucide-react';
import { useOutletContext } from 'react-router-dom'; // ✅ AJOUTER CET IMPORT

const HotelsList = () => {
  // ✅ REMPLACER LA PROP PAR LE CONTEXTE
  const [searchTerm] = useOutletContext(); 
  
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [newHotel, setNewHotel] = useState({
    name: '',
    location: '',
    price_per_night: '',
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
      console.error("Erreur chargement:", err);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // ✅ LOGIQUE DE FILTRAGE
  // On filtre la liste "hotels" pour créer "filteredHotels"
  const filteredHotels = hotels.filter((hotel) => {
    const search = searchTerm.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(search) || 
      hotel.location.toLowerCase().includes(search)
    );
  });

  const deleteHotel = async (id) => {
    if (window.confirm("Supprimer cet hôtel ?")) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`http://127.0.0.1:8000/api/hotels/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchHotels();
      } catch (err) {
        alert("Erreur suppression");
      }
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('name', newHotel.name);
    formData.append('location', newHotel.location);
    formData.append('price_per_night', newHotel.price_per_night);
    if (newHotel.image) {
      formData.append('image', newHotel.image);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/hotels/", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setShowModal(false);
      setNewHotel({ name: '', location: '', price_per_night: '', image: null });
      fetchHotels();
    } catch (err) {
      alert("Erreur : " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#f8f9fa] font-sans">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium text-gray-800">Hôtels</h1>
          {/* ✅ On affiche le nombre d'hôtels filtrés */}
          <span className="text-gray-400 text-sm">{filteredHotels.length}</span>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-all"
        >
          <Plus size={18} /> Créer un nouveau hôtel
        </button>
      </header>

      {/* ✅ On utilise "filteredHotels" au lieu de "hotels" pour le map */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => deleteHotel(hotel.id)} className="p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50">
                  <Trash size={14} />
                </button>
              </div>

              <img 
                src={hotel.image || "https://via.placeholder.com/300x200"} 
                alt={hotel.name} 
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <p className="text-[10px] text-[#FFD700] font-bold uppercase truncate">{hotel.location}</p>
                <h3 className="font-bold text-gray-800 text-sm truncate my-1">{hotel.name}</h3>
                <p className="text-xs text-gray-600">{hotel.price_per_night} XOF par nuit</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400">
            Aucun hôtel ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Modal ... (le reste du code du modal reste inchangé) */}
      {/* ... */}
    </main>
  );
};

export default HotelsList;