import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import CustomSelect from "../../components/CustomSelect";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Input from "../../components/Input";

const AjoutMateriel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [selectedIdDA, setSelectedIdDA] = useState(null);
  const [selectedDAItems, setSelectedDAItems] = useState([]);
  const [isSansDA, setIsSansDA] = useState(false);

  const [formData, setFormData] = useState({
    demande_achat_id: "",
    numero_da: "",
    dateReception: today,
    type: "",
    marque: "",
    model: "",
    numeroSerie: "",
    quantity: 1,
    config: "",
    description: "",
    site: "",
    etat: "Neuf",
  });

  const [das, setDas] = useState([]);
  const [equipements, setEquipements] = useState([]);

  /** 🔹 Fetch DA */
  const fetchDA = async () => {
    try {
      setLoading(true);
      const res = await api.get("/da");
      setDas(res.data);
    } catch (err) {
      console.error("Erreur chargement DA", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Fetch Equipements */
  const fetchEquipements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/equipements");
      setEquipements(res.data);
    } catch (err) {
      console.error("Erreur chargement Equipements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDA();
    fetchEquipements();
  }, []);

  /** 🔹 Fonction utilitaire : calculer le reste d'un article */
  const getResteArticle = (daId, article) => {
    const dejaSaisis = equipements
      .filter(
        (e) =>
          (e.demande_achat_id === daId || e.numero_da === article.numero_da) &&
          e.type === article.libelle
      )
      .reduce((sum, e) => sum + Number(e.quantity), 0);
    return Number(article.quantite) - dejaSaisis;
  };

  /** 🔹 Options DA (CustomSelect) : seulement DA avec au moins un article dispo */
  const optionsDA = das
    .filter((da) =>
      Array.isArray(da.items) &&
      da.items.some(
        (item) =>
          item.categorie === "Immobilisation" &&
          Number(item.status) === 1 &&
          getResteArticle(da.id, item) > 0
      )
    )
    .map((da) => ({
      value: da.id,
      label: `${da.numero_da} - ${da.site}`,
    }));

  /** 🔹 Gestion générique des champs */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Champs spécifiques selon type de matériel */
  const renderConfigFields = () => {
    switch (formData.type) {
      case "Ordinateur":
        return (
          <div>
            <label className="block text-sm mb-1">Configuration</label>
            <input
              name="config"
              placeholder="Intel i5 / 8Go RAM / SSD 256Go"
              value={formData.config}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
            />
          </div>
        );
      case "Imprimante":
        return (
          <div>
            <label className="block text-sm mb-1">Vitesse (ppm)</label>
            <input
              name="config"
              placeholder="Ex: 30 ppm"
              value={formData.config}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
            />
          </div>
        );
      case "Onduleur":
        return (
          <div>
            <label className="block text-sm mb-1">Autonomie (minutes)</label>
            <input
              name="config"
              placeholder="Ex: 10 minutes"
              value={formData.config}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
            />
          </div>
        );
      case "Ecran":
        return (
          <div>
            <label className="block text-sm mb-1">Taille (pouces)</label>
            <input
              name="config"
              placeholder="Ex: 24 pouces / Full HD"
              value={formData.config}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
            />
          </div>
        );
      default:
        return null;
    }
  };

  /** 🔹 Soumission formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSansDA && !selectedIdDA) {
      alert("Veuillez sélectionner une DA ou cocher 'Sans DA'.");
      return;
    }

    if (!formData.type.trim() || !formData.site) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/equipements", formData);
      alert("Équipement ajouté avec succès !");
      navigate("/materiels");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’ajout !");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Calcul quantité max selon DA + article */
  const selectedArticle = selectedDAItems.find(
    (it) => it.libelle === formData.type
  );
  const qteDejaSaisie = selectedArticle
    ? equipements
        .filter(
          (e) =>
            (e.demande_achat_id === selectedIdDA ||
              e.numero_da === formData.numero_da) &&
            e.type === selectedArticle.libelle
        )
        .reduce((sum, e) => sum + Number(e.quantity), 0)
    : 0;
  const maxAutorise = selectedArticle ? selectedArticle.quantite - qteDejaSaisie : 999;

  return (
    <div className="pt-2">
      <div className="bg-[#343a40] p-4 rounded-lg mb-6 text-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Ajouter un Matériel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION DA */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Options DA</label>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={isSansDA}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSansDA(checked);
                    if (checked) {
                      setSelectedIdDA(null);
                      setSelectedDAItems([]);
                      setFormData((prev) => ({
                        ...prev,
                        demande_achat_id: "",
                        numero_da: "",
                        site: "",
                      }));
                    }
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="text-sm">Sans Demande d'Achat</span>
              </label>
            </div>

            <div>
              <label className="block text-sm mb-1">N° Demande d’Achat</label>
              <div
                className={`${isSansDA ? "opacity-40 pointer-events-none" : ""}`}
              >
                <CustomSelect
                  options={optionsDA}
                  placeholder="Ex: DA001"
                  value={optionsDA.find((o) => o.value === selectedIdDA) || null}
                  onChange={(option) => {
                    const da = das.find((d) => d.id === option.value);
                    setSelectedIdDA(option.value);
                    setSelectedDAItems(da?.items || []);
                    setFormData((prev) => ({
                      ...prev,
                      demande_achat_id: da?.id || "",
                      numero_da: da?.numero_da || "",
                      site: da?.site || prev.site,
                    }));
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Date de réception</label>
              <Input
                type="date"
                name="dateReception"
                value={formData.dateReception}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Site</label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                className={`w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 ${
                  !isSansDA && selectedIdDA ? "opacity-60 cursor-not-allowed" : ""
                }`}
                required
                disabled={!isSansDA && selectedIdDA}
              >
                <option value="">-- Sélectionnez --</option>
                <option value="HITA1">HITA1</option>
                <option value="HITA2">HITA2</option>
                <option value="HITA TANA">HITA TANA</option>
              </select>
            </div>
          </div>

          {/* SECTION Article / Type de matériel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">
                {isSansDA ? "Type de matériel *" : "Article de la DA *"}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 text-white outline-none"
                required
              >
                <option value="">-- Sélectionnez --</option>

                {isSansDA
                  ? ["Ordinateur", "Imprimante", "Onduleur", "Ecran"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  : selectedDAItems
                      .filter(
                        (item) =>
                          item.categorie === "Immobilisation" &&
                          Number(item.status) === 1 &&
                          getResteArticle(selectedIdDA, item) > 0
                      )
                      .map((item) => (
                        <option key={item.id} value={item.libelle}>
                          {item.libelle} (Reste: {getResteArticle(selectedIdDA, item)})
                        </option>
                      ))}
              </select>
            </div>

            {/* Marque / Modèle / Numéro de série */}
            {["marque", "model", "numeroSerie"].map((field) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {field === "model"
                    ? "Modèle "
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "marque"
                      ? "Ex : Lenovo"
                      : field === "model"
                      ? "Ex : ThinkPad X1"
                      : "Ex : SN-4587-LNV-742"
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
                />
              </div>
            ))}
          </div>

          {/* CONFIG / Description / Quantité / État */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {renderConfigFields()}

            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-400">Quantité</label>
              <Input
                type="number"
                name="quantity"
                min="1"
                max={isSansDA ? 999 : maxAutorise}
                value={formData.quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isSansDA && val > maxAutorise) {
                    alert(`Action refusée : Il ne reste que ${maxAutorise} à enregistrer.`);
                    return;
                  }
                  handleChange(e);
                }}
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-400">Etat</label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleChange}
                className="w-full p-[9px] text-sm rounded bg-[#3d454d] border border-gray-600 focus:border-blue-500 outline-none transition-all"
              >
                <option value="Neuf">Neuf</option>
                <option value="En Service">En Service</option>
                <option value="En Panne">En Panne</option>
                <option value="Hors Service">Hors Service</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="block text-sm mb-1 text-gray-400">Description</label>
              <Input
                type="text"
                name="description"
                className="w-full"
                value={formData.description}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-md text-white flex items-center gap-2"
            >
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutMateriel;
