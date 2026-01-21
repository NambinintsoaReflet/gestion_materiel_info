import React, { useEffect, useState } from "react";
import { FaPlus, FaClipboardList, FaBoxOpen, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";

const EntreeStock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [isSansDA, setIsSansDA] = useState(false);
  const [das, setDas] = useState([]); 
  const [articlesList, setArticlesList] = useState([]); 
  const [entreesExistantes, setEntreesExistantes] = useState([]);

  // Utilisation exacte de votre structure formData
  const [formData, setFormData] = useState({
    demande_achat_id: "",
    dateReception: today,
    quantity: 1,
    site: "",
    affectation:"null",
    type: "entrée stock",
    id_article: "",
  });

  // État local pour gérer le numéro de DA affiché dans l'input (pour la recherche)
  const [numeroDAInput, setNumeroDAInput] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resDA, resArt, resEquip] = await Promise.all([
        api.get("/da"),
        api.get("/articles"),
        api.get("/equipements")
      ]);
      setDas(resDA.data);
      setArticlesList(resArt.data);
      setEntreesExistantes(resEquip.data);
    } catch (err) {
      console.error("Erreur chargement données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Identification de la DA pour lier l'ID et le Site
  const currentDA = das.find(d => d.numero_da === numeroDAInput);

  // 2. Options d'articles : Liste complète mappée sur id_article
  const articleOptions = articlesList.map((art) => ({
    value: art.id, // L'ID devient la valeur
    label: art.designation, // La désignation devient le label
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSansDA && !formData.demande_achat_id) return alert("Saisissez un numéro de DA valide.");
    if (!formData.id_article || !formData.site) return alert("Veuillez sélectionner un article et un site.");

    setLoading(true);
    try {
         console.log("Données soumises :", formData);
      const res = await api.post("/mouvement-articles", formData);
      console.log(res.data);
      alert("Entrée en stock enregistrée avec succès !");
      navigate("/article");
 
    } catch (err) {
      alert("Erreur lors de l’enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-700 pb-4">
        <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
          <FaPlus className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Entrée en Stock</h1>
          <p className="text-gray-400 text-sm">Nouvelle réception de matériel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SOURCE DE RÉCEPTION */}
        <div className="bg-[#2d3238] rounded-xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-blue-400 text-sm font-bold uppercase mb-6 flex items-center gap-2">
            <FaClipboardList /> Source
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isSansDA}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSansDA(checked);
                    setNumeroDAInput("");
                    setFormData(prev => ({ ...prev, demande_achat_id: "", site: "" }));
                  }}
                  className="w-4 h-4 accent-blue-500 rounded"
                />
                <span className="text-gray-200">Sans Demande d'Achat</span>
              </label>
            </div>

            <div className={`space-y-2 ${isSansDA ? "opacity-30 pointer-events-none" : ""}`}>
              <label className="text-xs font-bold text-gray-500 uppercase">N° DA (Saisie)</label>
              <Input
                value={numeroDAInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setNumeroDAInput(val);
                  const daFound = das.find(d => d.numero_da === val);
                  if(daFound) {
                    setFormData(prev => ({ 
                      ...prev, 
                      demande_achat_id: daFound.id, 
                      site: daFound.site 
                    }));
                  } else {
                    setFormData(prev => ({ ...prev, demande_achat_id: "" }));
                  }
                }}
                placeholder="Ex: DA-001"
              />
              {currentDA && <p className="text-[10px] text-green-400 font-bold">✅ DA Validée</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FaCalendarAlt /> Date Réception
              </label>
              <Input type="date" name="dateReception" value={formData.dateReception} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* DÉTAILS ARTICLE */}
        <div className="bg-[#2d3238] rounded-xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-green-400 text-sm font-bold uppercase mb-6 flex items-center gap-2">
            <FaBoxOpen /> Article & Stockage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Désignation Article</label>
              <CustomSelect
                options={articleOptions}
                placeholder="Rechercher l'article..."
                value={articleOptions.find(o => o.value === formData.id_article) || null}
                onChange={(option) => setFormData(prev => ({ ...prev, id_article: option.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FaMapMarkerAlt /> Site de destination
              </label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="w-full p-2.5 rounded bg-[#3d454d] border border-gray-600 text-white focus:border-blue-500 outline-none"
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="HITA1">HITA1</option>
                <option value="HITA2">HITA2</option>
                <option value="HITA TANA">HITA TANA</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Quantité</label>
              <Input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-all">
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 px-8 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <FaCheckCircle />}
            Valider l'Entrée
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntreeStock;