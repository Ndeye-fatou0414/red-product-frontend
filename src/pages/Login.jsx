import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Envoi de l'email et password à ton API sur Render
      const response = await axios.post("https://mon-projet-django-b8xs.onrender.com/api/token/", {
        email: identifier.trim(), // On retire les espaces inutiles
        password: password,
      });

      // ✅ Stockage des tokens (Indispensable pour Supprimer/Modifier)
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // ✅ Redirection vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion:", err.response);
      
      // Récupération du message d'erreur précis du backend
      const serverError = err.response?.data?.detail || 
                          err.response?.data?.non_field_errors?.[0] || 
                          "Email ou mot de passe incorrect.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#313538] font-sans overflow-hidden relative">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full border-[40px] border-white/5"></div>
        <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] rounded-full border-[50px] border-white/5"></div>
      </div>

      <div className="flex items-center gap-2 mb-6 z-10">
        <div className="w-5 h-5 bg-white flex items-center justify-center rounded-sm">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-[#313538]"></div>
        </div>
        <span className="text-white font-bold text-lg tracking-widest uppercase">Red Product</span>
      </div>

      <div className="w-[90%] max-w-[380px] bg-white rounded-md shadow-2xl p-8 z-10">
        <p className="text-gray-700 text-sm mb-6">Connectez-vous avec votre e-mail</p>

        {/* Affichage de l'erreur si elle existe */}
        {error && (
          <div className="mb-4 p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="mb-6 border-b border-gray-200">
            <input
              type="email"
              placeholder="Adresse e-mail"
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4a4d50] text-white py-3 rounded-md font-medium text-sm transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3f4245]"
            }`}
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center z-10">
        <p className="text-white text-xs">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-[#FFD700] font-bold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;