import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activation = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const handleActivation = async () => {
        try {
            await axios.post("https://mon-projet-django-b8xs.onrender.com/auth/users/activation/", {
                uid,
                token
            });
            alert("Compte activé ! Vous pouvez vous connecter.");
            navigate("/");
        } catch (err) {
            alert("Le lien est invalide ou a expiré.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#313538] text-white">
            <h1 className="text-2xl mb-4">Activation de votre compte</h1>
            <button onClick={handleActivation} className="bg-yellow-500 px-6 py-2 rounded text-black font-bold">
                Activer mon compte
            </button>
        </div>
    );
};