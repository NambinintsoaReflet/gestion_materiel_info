import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import SelectSearch from "react-select-search";
import Select from "react-select/base";
import CustomSelect from "../../components/CustomSelect";

const AjoutMateriel = () => {
  const today = new Date().toISOString().split("T")[0]; // 📅 Date du jour (YYYY-MM-DD)

  const [formData, setFormData] = useState({
    numeroDemande: "",
    dateDemande: today,
    type: "",
    marque: "",
    model: "",
    numeroSerie: "",
    quantity: "",
    description: "",
  });

  // les DA
  const [selectedIdDA, setSelectedIdDA] = useState(null);
  const da = [
    {
      id: 1,
      numeroDemande: "DA-001",
      dateDemande: "2025-10-25",
      description: "Dell Latitude 7420 pour usage bureautique",
      etat: "En cours",
    },
    {
      id: 2,
      numeroDemande: "DA-002",
      dateDemande: "2025-10-20",
      description: "HP LaserJet Pro M404",
      etat: "Livre",
    },
  ];

  // Transformer les achats pour CustomSelect
  const options = da.map((a) => ({
    value: a.id,
    label: `${a.numeroDemande} - ${a.description}`,
  }));
  ///

  // 🧩 Gérer la saisie dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🧩 Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.model.trim() || !formData.type.trim()) {
      alert("Veuillez remplir au moins le modèle et le type.");
      return;
    }

    // console.log("✅ Données à envoyer :", formData);

    // Réinitialisation du formulaire
    setFormData({
      numeroDemande: "",
      dateDemande: today,
      type: "",
      marque: "",
      model: "",
      numeroSerie: "",
      quantity: "",
      description: "",
    });
    setSelectedIdDA(null);
  };

  return (
    <div className="p-4">
      {/* -------- Formulaire -------- */}
      <div className="bg-[#343a40] p-4 rounded-lg mb-6 text-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Ajouter un matériel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ligne 1 : N° Demande + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">N° Demande d’achat</label>
              <CustomSelect
                options={options}
                placeholder="Ex: DA-001"
                value={options.find((o) => o.value === selectedIdDA) || null}
                onChange={(option) => {
                  setSelectedIdDA(option.value); // stocke juste l'ID si besoin
                  setFormData((prev) => ({
                    ...prev,
                    numeroDemande:
                      da.find((d) => d.id === option.value)?.numeroDemande ||
                      "",
                  }));
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Date d’ajout</label>
              <input
                type="date"
                name="dateDemande"
                value={formData.dateDemande}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Ligne 2 : Type, Marque, Modèle, N° Série */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Ex: Ordinateur portable"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Marque</label>
              <input
                type="text"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                placeholder="Ex: Lenovo"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Modèle</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ex: ThinkPad X1"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">N° de série</label>
              <input
                type="text"
                name="numeroSerie"
                value={formData.numeroSerie}
                onChange={handleChange}
                placeholder="Ex: SN-4587-LNV-742"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Ligne 3 : Quantité + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Quantité</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                placeholder="Ex: 5"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Pour usage bureautique"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Bouton d’ajout */}
          <div className="text-right pt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 transition px-6 py-2 rounded-md text-white font-medium"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutMateriel;
