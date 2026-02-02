import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activation = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    // 🌍 DETECTION AUTOMATIQUE DE L'URL (Local vs Render)
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://127.0.0.1:8000" 
        : "https://mon-projet-django-b8xs.onrender.com";

    const handleActivation = async () => {
        try {
            // Utilisation de l'URL dynamique
            await axios.post(`${API_BASE_URL}/auth/users/activation/`, {
                uid,
                token
            });
            alert("Compte activé ! Vous pouvez vous connecter.");
            navigate("/"); // Redirection vers le login
        } catch (err) {
            console.error("Erreur activation:", err.response?.data);
            alert("Le lien est invalide ou a expiré.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#313538] text-white">
            <h1 className="text-2xl mb-4 font-bold">Activation de votre compte</h1>
            <p className="mb-6 text-gray-300">Cliquez sur le bouton ci-dessous pour confirmer votre inscription.</p>
            <button 
                onClick={handleActivation} 
                className="bg-[#FFD700] hover:bg-yellow-500 px-8 py-3 rounded text-black font-extrabold transition-colors shadow-lg"
            >
                ACTIVER MON COMPTE
            </button>
        </div>
    );
};

// 🔑 L'EXPORT MANQUANT QUI CAUSAIT L'ERREUR :
export default Activation;