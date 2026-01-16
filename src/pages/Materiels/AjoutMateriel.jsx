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
    etat: "",
  });

  const [das, setDas] = useState([]);
  const fetchDA = async () => {
    try {
      setLoading(true);
      const res = await api.get("/da").finally(() => setLoading(false));
      setDas(res.data);
    } catch (err) {
      console.error("Erreur chargement DA", err);
    }
  };

  const [equipements, setEquipements] = useState([]);
  const fetchEquipement = async () => {
    try {
      setLoading(true);
      const res = await api
        .get("/equipements")
        .finally(() => setLoading(false));
      setEquipements(res.data);
      console.log("📦 Équipements chargés :", res.data);
    } catch (err) {
      console.error("Erreur chargement Equipements", err);
    }
  };

  useEffect(() => {
    fetchDA();
    fetchEquipement();
  }, []);

  console.log("📌 DA disponibles :", das);
  console.log("📌 Équipements chargés :", equipements);

  // options = liste des DA avec au moins un article "restant" ET validé (status 1)
  const options = das
    .filter((da) => {
      // On ne garde que les DA qui ont au moins un article répondant aux critères
      const aEncoreDesArticlesDisponibles = da.items.some((item) => {
        // 1. CONDITION : Catégorie Immobilisation uniquement
        if (item.categorie !== "Immobilisation") return false;

        // 2. CONDITION : L'article doit être validé (status === 1)
        // On ajoute Number() au cas où le status arrive en string
        if (Number(item.status) !== 1) return false;

        // 3. CONDITION : Calcul du reste à saisir
        const dejaSaisis = equipements
          .filter(
            (e) =>
              (e.demande_achat_id === da.id || e.numero_da === da.numero_da) &&
              e.type === item.libelle
          )
          .reduce((sum, e) => sum + Number(e.quantity), 0);

        // L'article est disponible s'il reste au moins 1 unité à saisir
        return dejaSaisis < item.quantite;
      });

      return aEncoreDesArticlesDisponibles;
    })
    .map((a) => ({
      value: a.id,
      label: `${a.numero_da} - ${a.site}`,
    }));

  console.log(options);

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
    if (!formData.type.trim() || !formData.site) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    try {
      console.log("📌 Matériel envoyé :", formData, selectedIdDA);

      const res = await api.post("/equipements", formData);
      alert("Équipement ajouté avec succès !");
      navigate("/materiels");
      console.log("✅ Équipement ajouté :", res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’ajout !");
    } finally {
      setLoading(false);
    }
  };

  // SAISIE DU QUANTITE MAX
  const selectedArticleData = selectedDAItems.find(
    (it) => it.libelle === formData.type
  );

  // Calcul du reste pour l'article actuellement choisi dans le select
  const qteDejaSaisie = equipements
    .filter(
      (e) =>
        (e.demande_achat_id === selectedIdDA ||
          e.numero_da === formData.numero_da) &&
        e.type === formData.type
    )
    .reduce((sum, e) => sum + Number(e.quantity), 0);

  const maxAutorise = selectedArticleData
    ? selectedArticleData.quantite - qteDejaSaisie
    : 999;

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
                      demande_achat_id: selectedDA?.id || "",
                      // On garde numero_da si vous en avez besoin pour l'affichage ou d'autres calculs
                      numero_da: selectedDA?.numero_da || "",
                      site: selectedDA?.site || prev.site,
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
                    !isSansDA &&
                    selectedDAItems
                      .filter(
                        (item) =>
                          item.categorie === "Immobilisation" &&
                          Number(item.status) === 1 // 🔹 On ne garde que les articles validés
                      )
                      .map((item) => {
                        // 1. Calculer combien on a déjà enregistré pour cet article précis
                        const dejaEnregistres = equipements
                          .filter(
                            (e) =>
                              (e.demande_achat_id === selectedIdDA ||
                                e.numero_da === formData.numero_da) &&
                              e.type === item.libelle
                          )
                          .reduce((sum, e) => sum + Number(e.quantity), 0);

                        const reste = item.quantite - dejaEnregistres;

                        // 2. Si le quota est atteint ou si l'article n'a plus de reste, on cache
                        if (reste <= 0) return null;

                        return (
                          <option key={item.id} value={item.libelle}>
                            {item.libelle} (Reste : {reste})
                          </option>
                        );
                      })
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {renderConfigFields()}

            {/* Quantité : occupe 1 colonne */}
            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-400">
                Quantité
              </label>
              <Input
                type="number"
                name="quantity"
                min="1"
                max={isSansDA ? 999 : maxAutorise} // Bloque la flèche du haut
                value={formData.quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  // Empêche de taper un chiffre trop haut au clavier
                  if (!isSansDA && val > maxAutorise) {
                    alert(
                      `Action refusée : Il ne reste que ${maxAutorise} à enregistrer.`
                    );
                    return;
                  }
                  handleChange(e);
                }}
              />
            </div>

            {/* Etat : occupe 1 colonne pour équilibrer la ligne si possible */}
            <div className="flex flex-col">
              <label className="block text-sm mb-1 text-gray-400">Etat</label>
              <select
                name="etat"
                id="etat"
                value={formData.etat}
                onChange={handleChange}
                className="w-full p-[9px] text-sm rounded bg-[#3d454d] border border-gray-600 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">-- Sélectionnez --</option>
                <option value="Neuf">Neuf</option>
                <option value="En Service">En Service</option>
                <option value="En Panne">En Panne</option>
                <option value="Hors Service">Hors Service</option>
              </select>
            </div>

            {/* Description : occupe 2 colonnes pour laisser de la place au texte */}
            <div className="md:col-span-2 flex flex-col">
              <label className="block text-sm mb-1 text-gray-400">
                Description
              </label>
              <Input
                type="text"
                name="description"
                className="w-full"
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
