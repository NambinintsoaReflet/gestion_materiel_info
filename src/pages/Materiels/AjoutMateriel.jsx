import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AjoutMateriel = () => {
  const today = new Date().toISOString().split("T")[0]; // 📅 Date du jour (YYYY-MM-DD)

  const [formData, setFormData] = useState({
    numeroDemande: "",
    dateDemande: today, // 📌 auto-rempli avec la date d’aujourd’hui
    marque: "",
    model: "",
    type: "",
    description: "",
    quantity: "",
  });

  // Gérer la saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.model || !formData.type) {
      alert("Veuillez remplir au moins le modèle et le type.");
      return;
    }

    // 🔹 Envoi au backend (à adapter selon ton API Laravel)
    console.log("✅ Données à envoyer :", formData);

    // Réinitialisation du formulaire (avec date du jour)
    setFormData({
      numeroDemande: "",
      dateDemande: today,
      marque: "",
      model: "",
      type: "",
      description: "",
      quantity: "",
    });
  };

  return (
    <div className="p-4">
      {/* -------- Formulaire -------- */}
      <div className="bg-[#343a40] p-4 rounded-lg mb-6 text-white">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FaPlus /> Ajouter un matériel
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm mb-1">N° Demande d’achat</label>
            <input
              type="text"
              name="numeroDemande"
              value={formData.numeroDemande}
              onChange={handleChange}
              placeholder="Ex: DA-73/25/H2"
              className="w-full p-1 pl-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Date de la demande</label>
            <input
              type="date"
              name="dateDemande"
              value={formData.dateDemande}
              onChange={handleChange}
              className="w-full p-1 pl-2 rounded text-sm bg-[#3d454d] border border-gray-500 outline-none text-white"
            />
          </div>

          <br />
          <div>
            <label className="block text-sm mb-1">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Ex: Ordinateur portable"
              className="w-full p-1 pl-2 rounded text-sm bg-[#3d454d] border border-gray-500 outline-none text-white"
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
              className="w-full p-1 pl-2 rounded text-sm bg-[#3d454d] border border-gray-500 outline-none text-white"
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
              className="w-full p-1 pl-2 rounded text-sm bg-[#3d454d] border border-gray-500 outline-none text-white"
            />
          </div>

          <div className="col-span-2 md:col-span-3">
            <label className="block text-sm mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Pour usage bureautique"
              className="w-full p-1 pl-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Quantité</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              placeholder="1"
              className="w-full p-1 pl-2 rounded text-sm bg-[#3d454d] border border-gray-500 outline-none text-white"
            />
          </div>

          <div className="col-span-2 md:col-span-3 text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white font-medium"
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
