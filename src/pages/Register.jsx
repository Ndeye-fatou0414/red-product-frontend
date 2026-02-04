import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://mon-projet-django-b8xs.onrender.com/auth/users/",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          re_password: formData.password,
        }
      );

      alert(
        "Inscription réussie 🎉\n\nUn email d’activation vient de vous être envoyé.\nVeuillez vérifier votre boîte mail pour activer votre compte."
      );

      // 👉 On redirige vers le login, MAIS le compte reste inactif
      navigate("/login");
    } catch (err) {
      console.error("Erreur inscription :", err.response?.data);

      let message = "Erreur lors de l’inscription";

      if (err.response?.data) {
        message = Object.values(err.response.data)
          .flat()
          .join("\n");
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#313538] font-sans overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full border-[40px] border-white/5"></div>
        <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] rounded-full border-[50px] border-white/5"></div>
      </div>

      <div className="flex items-center gap-2 mb-5 z-10">
        <div className="w-5 h-5 bg-white flex items-center justify-center rounded-sm">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-[#313538]"></div>
        </div>
        <span className="text-white font-bold text-lg tracking-widest uppercase">
          Red Product
        </span>
      </div>

      <div className="w-[90%] max-w-[380px] bg-white rounded-md shadow-2xl p-7 z-10">
        <p className="text-gray-700 text-sm mb-6 font-medium text-center md:text-left">
          Inscription administrateur
        </p>

        <form onSubmit={handleRegister} className="flex flex-col">
          <div className="mb-5 border-b border-gray-200">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="w-full py-2 focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-5 border-b border-gray-200">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full py-2 focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-5 border-b border-gray-200">
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full py-2 focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 accent-[#4a4d50] cursor-pointer"
            />
            <label htmlFor="terms" className="text-gray-600 text-xs cursor-pointer">
              Accepter les termes et conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4a4d50] text-white py-3 rounded-md font-medium text-sm transition-all ${
              loading ? "opacity-50" : "hover:bg-[#3f4245]"
            }`}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
      </div>

      <div className="mt-5 text-center z-10">
        <p className="text-white text-xs">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-[#FFD700] font-bold hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
