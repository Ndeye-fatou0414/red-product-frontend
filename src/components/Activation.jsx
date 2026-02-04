import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activation = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    // 🌍 DETECTION AUTOMATIQUE DE L'URL (Local vs Render)
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://127.0.0.1:8000" 
        : "https://mon-projet-django-b8xs.onrender.com";

    // ✅ ACTIVATION AUTOMATIQUE AU CHARGEMENT
    useEffect(() => {
        const activateAccount = async () => {
            try {
                await axios.post(`${API_BASE_URL}/auth/users/activation/`, {
                    uid,
                    token
                });
                
                setStatus('success');
                setMessage('Votre compte a été activé avec succès !');
                
                // Redirection automatique après 3 secondes
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
                
            } catch (err) {
                console.error("Erreur activation:", err.response?.data);
                setStatus('error');
                
                // Messages d'erreur plus précis
                if (err.response?.status === 403) {
                    setMessage("Ce compte est déjà activé. Vous pouvez vous connecter.");
                } else if (err.response?.status === 400) {
                    setMessage("Le lien d'activation est invalide ou a expiré.");
                } else {
                    setMessage(
                        err.response?.data?.detail || 
                        "Une erreur est survenue lors de l'activation."
                    );
                }
            }
        };

        if (uid && token) {
            activateAccount();
        } else {
            setStatus('error');
            setMessage('Lien d\'activation invalide.');
        }
    }, [uid, token, navigate, API_BASE_URL]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#313538] text-white p-4">
            <div className="bg-[#1e2022] p-8 rounded-xl shadow-2xl max-w-md w-full">
                
                {/* ⏳ CHARGEMENT */}
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#FFD700] mb-6"></div>
                        <h1 className="text-2xl mb-2 font-bold">Activation en cours...</h1>
                        <p className="text-gray-400">Veuillez patienter</p>
                    </div>
                )}

                {/* ✅ SUCCÈS */}
                {status === 'success' && (
                    <div className="text-center">
                        <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <svg 
                                className="w-12 h-12 text-green-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl mb-2 font-bold text-[#FFD700]">
                            Compte activé !
                        </h1>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <div className="flex items-center justify-center text-sm text-gray-400">
                            <svg 
                                className="animate-spin h-4 w-4 mr-2" 
                                viewBox="0 0 24 24"
                            >
                                <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Redirection vers la connexion...
                        </div>
                    </div>
                )}

                {/* ❌ ERREUR */}
                {status === 'error' && (
                    <div className="text-center">
                        <div className="bg-red-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <svg 
                                className="w-12 h-12 text-red-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl mb-2 font-bold text-red-500">
                            Erreur d'activation
                        </h1>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-[#FFD700] hover:bg-yellow-500 px-6 py-3 rounded-lg text-black font-bold transition-all shadow-lg"
                        >
                            Retour à la connexion
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activation;