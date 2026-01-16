import React, { useState, useEffect } from "react";
import { FaArrowDown, FaSave } from "react-icons/fa";
import { api } from "../../api/axios";
import CustomSelect from "../../components/CustomSelect";

const EntreeStock = () => {
  const [das, setDas] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSansDA, setIsSansDA] = useState(false);
  const [selectedIdDA, setSelectedIdDA] = useState(null);
  const [selectedDAItems, setSelectedDAItems] = useState([]);

  const [formData, setFormData] = useState({
    article_id: "", 
    designation: "", 
    quantite: 1,
    reference_da: "", 
    motif: "Réception livraison",
    date_mouvement: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDA, resMouv] = await Promise.all([
          api.get("/da"),
          api.get("/stock/mouvement")
        ]);
        setDas(resDA.data);
        setMouvements(resMouv.data || []);
      } catch (err) {
        console.error("Erreur chargement", err);
      }
    };
    fetchData();
  }, []);

  /* 1. Logique Filtrage DA (Uniquement Consommables + Status 1 + Reste > 0) */
  const optionsDA = das
    .filter((da) => {
      return da.items.some((item) => {
        if (item.categorie !== "Consommable" || Number(item.status) !== 1) return false;
        const dejaRecu = mouvements
          .filter((m) => m.reference_da === da.numero_da && m.designation === item.libelle)
          .reduce((sum, m) => sum + Number(m.quantite), 0);
        return dejaRecu < item.quantite;
      });
    })
    .map((da) => ({
      value: da.id,
      label: `${da.numero_da} - ${da.site}`,
    }));

  /* 2. Calcul du Max Autorisé */
  const selectedArticle = selectedDAItems.find(it => it.libelle === formData.designation);
  const dejaRecuPourArticle = mouvements
    .filter((m) => m.reference_da === formData.reference_da && m.designation === formData.designation)
    .reduce((sum, m) => sum + Number(m.quantite), 0);
  
  // Si sans DA, pas de limite (999), sinon limite calculée
  const maxAutorise = (isSansDA || !selectedArticle) 
    ? 9999 
    : (selectedArticle.quantite - dejaRecuPourArticle);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSansDA && !selectedIdDA) return alert("Sélectionnez une DA ou cochez 'Sans DA'");
    if (formData.quantite > maxAutorise) return alert(`Limite dépassée ! Max: ${maxAutorise}`);

    setLoading(true);
    try {
      await api.post("/stock/mouvement", { ...formData, type: "ENTREE" });
      alert("Entrée en stock réussie !");
      setFormData({ ...formData, article_id: "", designation: "", quantite: 1 });
      setSelectedIdDA(null);
      setIsSansDA(false);
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#343a40] rounded-lg shadow-lg max-w-3xl mx-auto text-white">
      <h2 className="text-green-500 text-xl font-bold flex items-center gap-2 mb-6">
        <FaArrowDown /> Entrée en Stock (Consommables)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* CHECKBOX SANS DA */}
          <div className="bg-[#3d454d] p-3 rounded border border-gray-600">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-green-500"
                checked={isSansDA}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsSansDA(checked);
                  setSelectedIdDA(null);
                  setSelectedDAItems([]);
                  setFormData({...formData, reference_da: "", designation: "", article_id: ""});
                }}
              />
              <span className="text-sm font-medium">Entrée sans DA</span>
            </label>
          </div>

          {/* SÉLECTEUR DA */}
          <div className={`md:col-span-2 ${isSansDA ? "opacity-30 pointer-events-none" : ""}`}>
            <label className="block text-sm text-gray-400 mb-1">Référence DA</label>
            <CustomSelect
              options={optionsDA}
              placeholder="Sélectionner la DA..."
              value={optionsDA.find(o => o.value === selectedIdDA) || null}
              onChange={(option) => {
                const da = das.find(d => d.id === option.value);
                setSelectedIdDA(option.value);
                setSelectedDAItems(da?.items || []);
                setFormData({ ...formData, reference_da: da?.numero_da || "", designation: "" });
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SÉLECTEUR ARTICLE */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Article *</label>
            {isSansDA ? (
              <input 
                type="text"
                placeholder="Nom de l'article (ex: Rame de papier)"
                className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white outline-none focus:border-green-500"
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                required
              />
            ) : (
              <select 
                className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white outline-none"
                value={formData.designation}
                onChange={(e) => {
                  const art = selectedDAItems.find(it => it.libelle === e.target.value);
                  setFormData({...formData, designation: e.target.value, article_id: art?.id});
                }}
                required
                disabled={!selectedIdDA}
              >
                <option value="">-- Choisir l'article de la DA --</option>
                {selectedDAItems
                  .filter(item => item.categorie === "Consommable" && Number(item.status) === 1)
                  .map(item => {
                    const recu = mouvements
                      .filter(m => m.reference_da === formData.reference_da && m.designation === item.libelle)
                      .reduce((sum, m) => sum + Number(m.quantite), 0);
                    const reste = item.quantite - recu;
                    if (reste <= 0) return null;
                    return <option key={item.id} value={item.libelle}>{item.libelle} (Reste: {reste})</option>;
                  })
                }
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Date de réception</label>
            <input type="date" className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white" value={formData.date_mouvement} onChange={(e) => setFormData({...formData, date_mouvement: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Quantité {!isSansDA && formData.designation && `(Max: ${maxAutorise})`}
            </label>
            <input 
              type="number" min="1" max={maxAutorise}
              className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white outline-none"
              value={formData.quantite}
              onChange={(e) => setFormData({...formData, quantite: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Motif / Source</label>
            <input 
              type="text"
              placeholder="Ex: Facture N°..."
              className="w-full bg-[#3d454d] border border-gray-600 p-2 rounded text-white outline-none"
              value={formData.motif}
              onChange={(e) => setFormData({...formData, motif: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading || !formData.designation}
          className={`w-full font-bold py-3 rounded transition-all flex justify-center items-center gap-2 ${
            loading || !formData.designation ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 shadow-lg"
          }`}
        >
          <FaSave /> {loading ? "Traitement..." : "Enregistrer l'entrée en stock"}
        </button>
      </form>
    </div>
  );
};

export default EntreeStock;