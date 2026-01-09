import React, { useState, useEffect } from "react";
import { FaArrowUp, FaUser } from "react-icons/fa";
import { api } from "../../api/axios";

const SortieStock = () => {
  const [articles, setArticles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState({
    article_id: "",
    employee_id: "",
    quantite: 1,
    motif: ""
  });

  useEffect(() => {
    api.get("/articles").then(res => setArticles(res.data));
    api.get("/employees").then(res => setEmployees(res.data));
  }, []);

  const handleArticleChange = (id) => {
    const art = articles.find(a => a.id === parseInt(id));
    setSelectedArticle(art);
    setFormData({...formData, article_id: id});
  };

  return (
    <div className="p-6 bg-[#343a40] rounded-lg shadow-lg max-w-2xl mx-auto border-t-4 border-orange-500">
      <h2 className="text-orange-500 text-xl font-bold flex items-center gap-2 mb-6">
        <FaArrowUp /> Sortie de Stock (Attribution)
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Article à sortir *</label>
          <select 
            className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white"
            onChange={(e) => handleArticleChange(e.target.value)}
            required
          >
            <option value="">-- Sélectionner l'article --</option>
            {articles.map(art => (
              <option key={art.id} value={art.id}>
                {art.designation} (Dispo: {art.stock_actuel})
              </option>
            ))}
          </select>
          {selectedArticle && (
             <p className="text-xs mt-1 text-blue-400 italic">Stock disponible : {selectedArticle.stock_actuel} unités</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Bénéficiaire (Employé) *</label>
          <select 
            className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white"
            value={formData.employee_id}
            onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
            required
          >
            <option value="">-- Qui reçoit le matériel ? --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nom_complet} ({emp.departement})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantité *</label>
            <input 
              type="number" 
              max={selectedArticle?.stock_actuel}
              className={`w-full bg-[#3d454d] border p-2 rounded text-white ${formData.quantite > selectedArticle?.stock_actuel ? 'border-red-500' : 'border-gray-600'}`}
              value={formData.quantite}
              onChange={(e) => setFormData({...formData, quantite: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Motif</label>
            <select 
               className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white"
               value={formData.motif}
               onChange={(e) => setFormData({...formData, motif: e.target.value})}
            >
                <option value="Remplacement">Remplacement</option>
                <option value="Nouveau poste">Nouveau poste</option>
                <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {formData.quantite > selectedArticle?.stock_actuel && (
          <p className="text-red-500 text-xs font-bold">⚠️ Erreur : La quantité dépasse le stock disponible !</p>
        )}

        <button 
          type="button"
          disabled={!selectedArticle || formData.quantite > selectedArticle?.stock_actuel}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white font-bold py-2 rounded mt-4"
        >
          Valider la sortie
        </button>
      </form>
    </div>
  );
};

export default SortieStock;