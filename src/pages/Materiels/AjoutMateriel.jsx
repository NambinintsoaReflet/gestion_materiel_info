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

  // Formulaire principal
  const [formData, setFormData] = useState({
    demande_achat_id: "",
    dateReception: today,
    type: "",
    marque: "",
    model: "",
    numeroSerie: "",
    quantity: 1,
    config: "",
    description: "",
    site: "",
  });

  const [selectedIdDA, setSelectedIdDA] = useState(null);
  const [selectedDAItems, setSelectedDAItems] = useState([]);
  const [isSansDA, setIsSansDA] = useState(false);
  const [das, setDas] = useState([]);

  // Tableau des DA (à connecter plus tard)
  /* ================= FETCH DA ================= */
  const fetchDA = async () => {
    try {
      const res = await api.get("/da").finally(() => setLoading(false));
      setDas(res.data);
    } catch (err) {
      console.error("Erreur chargement DA", err);
    }
  };

  useEffect(() => {
    fetchDA();
  }, []);

  console.log("📌 DA disponibles :", das);
  // const das = [];

  const options = das.map((a) => ({
    value: a.id,
    label: `${a.numero_da} - ${a.site}`,
  }));

  /** 🔹 Gestion générique des champs */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Champs spéciaux selon le type de matériel */
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
          <>
            <div>
              <label className="block text-sm mb-1">Taille (pouces)</label>
              <input
                type="text"
                name="config"
                placeholder="Ex: 24 pouces / Full HD"
                value={formData.config}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  /** 🔹 Validation + soumission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation DA
    if (!isSansDA && !selectedIdDA) {
      alert("Veuillez sélectionner une DA ou cocher 'Sans DA'.");
      return;
    }

    // Validation champ obligatoire
    if ( !formData.type.trim() || !formData.site) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    try {
      console.log("📌 Matériel envoyé :", formData);
      const res = await api.post("/equipements", formData);
      console.log("📌 Matériel envoyé :", formData);
      alert("Équipement ajouté avec succès !");
      navigate("/materiels");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’ajout !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-[#343a40] p-4 rounded-lg mb-6 text-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Ajouter un Matériel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION DEMANDE D'ACHAT */}
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
                      setFormData((prev) => ({
                        ...prev,
                        demande_achat_id: "",
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
                className={`relative ${
                  isSansDA ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                {/* <CustomSelect
                  options={options}
                  placeholder="Ex: DA-001"
                  value={options.find((o) => o.value === selectedIdDA) || null}
                  onChange={(option) => {
                    setSelectedIdDA(option.value);
                    setFormData((prev) => ({
                      ...prev,
                      demande_achat_id:
                        das.find((d) => d.id === option.value)?.numero_da || "",
                    }));
                  }}
                /> */}
                <CustomSelect
                  options={options}
                  placeholder="Ex: DA-001"
                  value={options.find((o) => o.value === selectedIdDA) || null}
                  onChange={(option) => {
                    // 1. Trouver la DA correspondante dans la liste des DA chargées
                    const selectedDA = das.find((d) => d.id === option.value);

                    setSelectedIdDA(option.value);

                    // Récupération des articles de cette DA
                    const items = selectedDA?.items || [];
                    setSelectedDAItems(items);

                    // 2. Mettre à jour le formulaire avec le numéro de DA ET le site
                    setFormData((prev) => ({
                      ...prev,
                      numero_da: selectedDA?.numero_da || "",
                      site: selectedDA?.site || prev.site, // On remplit le site automatiquement
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
              {/* <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
                required
              >
                <option value="">-- Sélectionnez --</option>
                <option value="HITA1">HITA1</option>
                <option value="HITA2">HITA2</option>
                <option value="HITA TANA">HITA TANA</option>
              </select> */}

              <select
                name="site"
                value={formData.site} // ✅ Très important pour le remplissage automatique
                onChange={handleChange}
                className={`w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 ${
                  !isSansDA && selectedIdDA
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isSansDA && selectedIdDA} // ✅ Optionnel : bloque le champ si une DA est choisie
              >
                <option value="">-- Sélectionnez --</option>
                <option value="HITA1">HITA1</option>
                <option value="HITA2">HITA2</option>
                <option value="HITA TANA">HITA TANA</option>
              </select>
              {!isSansDA && selectedIdDA && (
                <p className="text-[10px] text-blue-400 mt-1 italic">
                  * Lié à la DA sélectionnée
                </p>
              )}
            </div>
          </div>

          {/* SECTION INFORMATIONS MATERIEL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
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

                  {isSansDA ? (
                    /* Options par défaut si pas de DA */
                    <>
                      <option value="Ordinateur">Ordinateur</option>
                      <option value="Imprimante">Imprimante</option>
                      <option value="Onduleur">Onduleur</option>
                      <option value="Ecran">Ecran</option>
                    </>
                  ) : (
                    /* Options basées sur les articles de la DA sélectionnée */
                    selectedDAItems.map((item) => (
                      <option key={item.id} value={item.libelle}>
                        {item.libelle}
                      </option>
                    ))
                  )}
                </select>

                {!isSansDA && selectedDAItems.length === 0 && !selectedIdDA && (
                  <p className="text-[10px] text-orange-400 mt-1">
                    ⚠️ Sélectionnez d'abord une DA pour voir les articles.
                  </p>
                )}
              </div>
            </div>

            {/* Marque / Modèle / Série */}
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
                      ? "Lenovo"
                      : field === "model"
                      ? "ThinkPad X1"
                      : "SN-4587-LNV-742"
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
          
                />
              </div>
            ))}
          </div>

          {/* SECTION CONFIG / DESCRIPTION */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Champs dynamiques selon le type */}
            {renderConfigFields()}

            <div>
              <label className="block text-sm mb-1">Quantité</label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Pour usage bureautique"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-md text-white flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Ajout en cours...
                </span>
              ) : (
                "Ajouter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutMateriel;
