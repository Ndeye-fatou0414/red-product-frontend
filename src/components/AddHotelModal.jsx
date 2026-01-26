import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddHotelModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. États pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);

  if (!isOpen) return null;

  // 2. Gérer les changements dans les champs textes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Logique d'envoi au clic sur "Enregistrer"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true);

    const token = localStorage.getItem("access_token");

    // On utilise FormData pour envoyer l'image et les textes ensemble
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("email", formData.email);
    data.append("phone_number", formData.phone);
    data.append("price_per_night", formData.price);
    if (imageFile) data.append("image", imageFile);

    try {
      await axios.post("http://127.0.0.1:8000/api/hotels/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Hôtel ajouté avec succès !");
      onClose(); // Fermer le modal
      window.location.reload(); // Rafraîchir la liste
    } catch (err) {
      // Gestion de l'erreur que tu vois sur tes photos (Token invalide/expiré)
      if (err.response?.status === 401) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        console.error(err);
        alert("Erreur lors de l'ajout de l'hôtel.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 flex items-center gap-4 border-b border-dotted border-gray-300">
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="uppercase font-bold text-gray-700 text-sm tracking-wide">Créer un nouveau hôtel</h3>
        </div>

        {/* 4. On lie le formulaire à la fonction handleSubmit */}
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Nom de l'hôtel</label>
              <input name="name" required onChange={handleChange} type="text" placeholder="CAP Marniane" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-gray-400 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Adresse</label>
              <input name="address" required onChange={handleChange} type="text" placeholder="Mar Lodj" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-gray-400 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">E-mail</label>
              <input name="email" required onChange={handleChange} type="email" placeholder="information@gmail.com" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-gray-400 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Numéro de téléphone</label>
              <input name="phone" required onChange={handleChange} type="text" placeholder="+221..." className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-gray-400 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Prix par nuit</label>
              <input name="price" required onChange={handleChange} type="number" placeholder="25000" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-gray-400 text-sm" />
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <label className="text-sm font-medium text-gray-600">Ajouter une photo</label>
            <input 
              type="file" 
              accept="image/*" 
              required
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#555555] text-white px-10 py-3 rounded-xl font-medium shadow-md disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotelModal;