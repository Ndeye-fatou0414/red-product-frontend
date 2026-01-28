import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, LogOut, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // État pour la photo (par défaut image pravatar)
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/40");

  // 1. Charger la photo actuelle depuis le backend au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/profile/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Si l'utilisateur a déjà un avatar en base de données, on l'affiche
        if (response.data.avatar) {
          setProfileImage(response.data.avatar);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  // 2. Gérer l'upload de la nouvelle image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await axios.patch("https://mon-projet-django-b8xs.onrender.com/api/user/profile/", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      // On met à jour l'affichage avec l'URL renvoyée par Django
      setProfileImage(response.data.avatar);
      alert("Photo de profil enregistrée !");

    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Impossible d'enregistrer la photo sur le serveur.");
    }
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-6">
        {/* BARRE DE RECHERCHE */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un hôtel..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-gray-200 w-64"
            onChange={(e) => onSearch(e.target.value)} 
          />
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] bg-yellow-400 text-white rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        {/* SECTION PROFIL INTERACTIVE */}
        <div 
          className="relative cursor-pointer group" 
          onClick={handleProfileClick}
        >
          <img
            src={profileImage}
            alt="user"
            className="w-9 h-9 rounded-full object-cover border border-gray-200 group-hover:brightness-75 transition-all"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={12} className="text-white" />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        <LogOut 
          className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800 transition" 
          onClick={handleLogout}
        />
      </div>
    </header>
  );
}