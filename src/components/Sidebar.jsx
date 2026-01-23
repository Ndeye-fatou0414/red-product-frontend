import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Ajout de useNavigate
import { LayoutGrid, Monitor, LogOut } from "lucide-react"; // Ajout de LogOut

export default function Sidebar() {
  const navigate = useNavigate(); // Hook pour la redirection

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Supprime le token d'accès
    localStorage.removeItem("refresh_token"); // Supprime le token de rafraîchissement
    navigate("/login"); // Redirige vers la page de connexion
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all ${
      isActive 
        ? "bg-white text-black font-bold shadow-md" 
        : "hover:bg-gray-700 text-gray-300"
    }`;

  return (
    <aside className="w-64 bg-[#343a40] text-white h-screen p-5 sticky top-0 flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
           <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#343a40] transform -rotate-45"></div>
        </div>
        <h2 className="text-lg font-bold tracking-wide">RED PRODUCT</h2>
      </div>

      {/* Navigation - flex-1 permet de prendre tout l'espace disponible */}
      <nav className="flex-1">
        <p className="text-gray-500 text-[10px] uppercase font-bold mb-4 px-2 tracking-widest">
          Principal
        </p>
        
        <ul className="space-y-2">
          <li>
            <NavLink to="/dashboard" end className={linkClass}>
              <LayoutGrid size={20} strokeWidth={2.5} />
              <span className="text-sm">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/hotels" className={linkClass}>
              <Monitor size={20} strokeWidth={2.5} />
              <span className="text-sm">Liste des hôtels</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* SECTION BAS DE PAGE : Déconnexion & Copyright */}
      <div className="pt-5 border-t border-gray-700 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all mb-4"
        >
          <LogOut size={20} strokeWidth={2.5} />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>

        <div className="text-[10px] text-gray-500 px-2">
          © 2026 Red Product Admin
        </div>
      </div>
    </aside>
  );
}