import React, { useEffect, useState } from "react";
import { FaMinus, FaBoxOpen, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle, FaUserTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";

const SortieStock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [articlesList, setArticlesList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_article: "",
    dateReception: today, 
    quantity: 1,
    site: "",
    affectation: "", // AJOUTÉ : Pour le user ou service
    type: "sortie stock", 
    demande_achat_id: null,
  });

  const [stockDisponible, setStockDisponible] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resArt = await api.get("/articles");
      setArticlesList(resArt.data);
    } catch (err) {
      console.error("Erreur chargement articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.id_article && formData.site) {
      const art = articlesList.find(a => a.id === formData.id_article);
      if (art) {
        const mapping = {
          'HITA1': art.stock_hita1,
          'HITA2': art.stock_hita2,
          'HITA TANA': art.stock_tanan
        };
        setStockDisponible(mapping[formData.site] || 0);
      }
    }
  }, [formData.id_article, formData.site, articlesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.quantity > stockDisponible) {
      return alert("Action impossible : Stock insuffisant sur ce site !");
    }
    
    if (!formData.affectation) {
      return alert("Veuillez préciser l'affectation.");
    }

    setLoading(true);
    try {
      console.log("Données soumises :", formData);
      await api.post("/mouvement-articles", formData);
      alert("Sortie de stock effectuée !");
      navigate("/article"); 
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sortie");
    } finally {
      setLoading(false);
    }
  };

  const articleOptions = articlesList.map((art) => ({
    value: art.id,
    label: art.designation,
  }));

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4 border-b border-red-900/50 pb-4">
        <div className="bg-red-600 p-3 rounded-lg shadow-lg">
          <FaMinus className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Sortie de Stock</h1>
          <p className="text-gray-400 text-sm">Déstockage de matériel / Consommation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1 : SOURCE ET DESTINATION */}
        <div className="bg-[#2d3238] rounded-xl p-4 shadow-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ARTICLE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FaBoxOpen /> Article à sortir
              </label>
              <CustomSelect
                options={articleOptions}
                placeholder="Sélectionner..."
                value={articleOptions.find(o => o.value === formData.id_article) || null}
                onChange={(option) => setFormData(prev => ({ ...prev, id_article: option.value }))}
              />
            </div>

            {/* SITE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FaMapMarkerAlt /> Site Source
              </label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-[#3d454d] border border-gray-600 text-white focus:border-red-500 outline-none"
                required
              >
                <option value="">-- Choisir le site --</option>
                <option value="HITA1">HITA1</option>
                <option value="HITA2">HITA2</option>
                <option value="HITA TANA">HITA TANA</option>
              </select>
            </div>

            {/* AFFECTATION (AJOUTÉ ICI) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FaUserTag /> Affectation (User/Service)
              </label>
              <Input 
                name="affectation" 
                placeholder="Ex: Commercial / Camera" 
                value={formData.affectation} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FaCalendarAlt /> Date de Sortie
              </label>
              <Input type="date" name="dateReception" value={formData.dateReception} onChange={handleChange} />
            </div>

          </div>
        </div>

        {/* SECTION 2 : QUANTITÉ ET INDICATEUR */}
        <div className="bg-[#2d3238] rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Quantité à prélever</label>
              <Input
                type="number"
                name="quantity"
                min="1"
                max={stockDisponible}
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            {/* INDICATEUR DE STOCK DISPONIBLE */}
            {formData.id_article && formData.site && (
              <div className={`p-4 rounded-lg border ${stockDisponible <= 0 ? 'bg-red-900/20 border-red-800' : 'bg-blue-900/20 border-blue-800'}`}>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-bold ${stockDisponible <= 0 ? 'text-red-500' : 'text-blue-400'}`}>
                    {stockDisponible}
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-300 font-bold uppercase text-[10px]">Stock actuel sur {formData.site}</p>
                    <p className="text-gray-500 text-xs">Unité(s) disponible(s)</p>
                  </div>
                </div>
                {formData.quantity > stockDisponible && (
                  <p className="text-red-500 text-[10px] mt-2 flex items-center gap-1">
                    <FaExclamationTriangle /> Quantité demandée supérieure au stock !
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 text-gray-400 hover:text-white transition-all">
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || stockDisponible <= 0 || formData.quantity > stockDisponible}
            className="bg-red-600 hover:bg-red-500 px-10 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <FaCheckCircle />}
            Valider la Sortie
          </button>
        </div>
      </form>
    </div>
  );
};

export default SortieStock;