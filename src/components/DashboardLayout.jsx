// src/components/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  // 1. On crée l'état de recherche ici
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* 2. On passe la fonction de mise à jour à la Navbar */}
        <Navbar onSearch={setSearchTerm} />

        <div className="flex-1">
          {/* 3. On envoie searchTerm aux pages enfants via le context de l'Outlet */}
          <Outlet context={[searchTerm]} />
        </div>
      </div>
    </div>
  );
}