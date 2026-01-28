import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // On utilise 'identifier' pour stocker soit l'email soit le username
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Appel à ton API Django (Assure-toi que ton serveur tourne sur le port 8000)
     const response = await axios.post("https://mon-projet-django-b8xs.onrender.com/api/token/", {
  email: identifier, // ✅ envoie bien l'email
  password: password,
});


      // Stockage des tokens pour rester connecté
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Redirection vers le tableau de bord
      navigate("/dashboard");
    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#313538] font-sans overflow-hidden relative">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full border-[40px] border-white/5"></div>
        <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] rounded-full border-[50px] border-white/5"></div>
      </div>

      {/* Logo / Titre */}
      <div className="flex items-center gap-2 mb-6 z-10">
        <div className="w-5 h-5 bg-white flex items-center justify-center rounded-sm">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-[#313538]"></div>
        </div>
        <span className="text-white font-bold text-lg tracking-widest uppercase">Red Product</span>
      </div>

      {/* Formulaire */}
      <div className="w-[90%] max-w-[380px] bg-white rounded-md shadow-2xl p-8 z-10">
        <p className="text-gray-700 text-sm mb-8">Connectez-vous en tant que Admin</p>

        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="mb-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="E-mail ou Nom d'utilisateur"
              className="w-full py-2 focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 border-b border-gray-200">
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full py-2 focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-8">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 accent-[#4a4d50] cursor-pointer" 
            />
            <label htmlFor="remember" className="text-gray-600 text-xs cursor-pointer">
              Gardez-moi connecté
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4a4d50] text-white py-3 rounded-md font-medium text-sm transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3f4245]"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      {/* Liens supplémentaires */}
      <div className="mt-6 text-center z-10">
        <Link to="/MotDePasseOublie" className="block text-[#FFD700] text-sm font-bold hover:underline mb-2">
          Mot de passe oublié ?
        </Link>
        <p className="text-white text-xs">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-[#FFD700] font-bold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
