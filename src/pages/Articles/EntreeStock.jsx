import React, { useState, useEffect } from "react";
import { FaArrowDown, FaSave } from "react-icons/fa";
import { api } from "../../api/axios";

const EntreeStock = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    article_id: "",
    quantite: 1,
    reference_da: "",
    motif: "Réception livraison",
    date_mouvement: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    // Charger la liste des articles pour le select
    api.get("/articles").then(res => setArticles(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // On envoie le mouvement de type ENTREE
      await api.post("/stock/mouvement", { ...formData, type: "ENTREE" });
      alert("Stock mis à jour avec succès !");
      setFormData({ ...formData, article_id: "", quantite: 1 });
    } catch (err) {
      alert("Erreur lors de l'entrée en stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#343a40] rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-green-500 text-xl font-bold flex items-center gap-2 mb-6">
        <FaArrowDown /> Entrée en Stock (Réception)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Article *</label>
          <select 
            className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white"
            value={formData.article_id}
            onChange={(e) => setFormData({...formData, article_id: e.target.value})}
            required
          >
            <option value="">-- Choisir l'article --</option>
            {articles.map(art => (
              <option key={art.id} value={art.id}>{art.designation} (Actuel: {art.stock_actuel})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantité reçue *</label>
            <input 
              type="number" min="1"
              className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white"
              value={formData.quantite}
              onChange={(e) => setFormData({...formData, quantite: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Réf. DA</label>
            <input 
              type="text"
              className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white"
              placeholder="Ex: DA-2024-001"
              value={formData.reference_da}
              onChange={(e) => setFormData({...formData, reference_da: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition-colors flex justify-center items-center gap-2"
        >
          <FaSave /> {loading ? "Enregistrement..." : "Confirmer l'entrée"}
        </button>
      </form>
    </div>
  );
};

export default EntreeStock;