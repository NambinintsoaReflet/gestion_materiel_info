import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#1a1d21] flex flex-col items-center justify-center p-4 text-center">
      {/* Icône d'alerte avec animation de pulsation */}
      <div className="relative mb-6">
        <FaExclamationTriangle className="text-yellow-500 text-8xl opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-white">404</span>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Oups ! Page introuvable
      </h1>
      
      <p className="text-gray-400 mb-8 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      {/* Bouton de retour vers l'accueil ou la liste des articles */}
      <Link
        to="/"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg active:scale-95"
      >
        <FaHome />
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;