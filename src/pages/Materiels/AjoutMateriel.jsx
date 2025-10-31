import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CustomSelect from "../../components/CustomSelect";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";

const AjoutMateriel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    numeroDemande: "",
    dateReception: today,
    type: "",
    marque: "",
    model: "",
    numeroSerie: "",
    quantity: "",
    description: "",
    site: "", // 🔹 ajout du site
  });

  const [selectedIdDA, setSelectedIdDA] = useState(null);
  const [isSansDA, setIsSansDA] = useState(false);

  const da = [
    // {
    //   id: 1,
    //   numeroDemande: "DA-001",
    //   dateDemande: "2025-10-25",
    //   description: "Dell Latitude 7420 pour usage bureautique",
    //   etat: "En cours",
    // },
    // {
    //   id: 2,
    //   numeroDemande: "DA-002",
    //   dateDemande: "2025-10-20",
    //   description: "HP LaserJet Pro M404",
    //   etat: "Livré",
    // },
  ];

  const options = da.map((a) => ({
    value: a.id,
    label: `${a.numeroDemande} - ${a.description}`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSansDA && !selectedIdDA) {
      alert("Veuillez sélectionner une DA ou cocher 'Sans DA'.");
      return;
    }

    if (!formData.model.trim() || !formData.type.trim()) {
      alert("Veuillez remplir au moins le modèle et le type.");
      return;
    }

    if (!formData.site) {
      alert("Veuillez sélectionner un site.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/equipements", formData);
      alert("✅ Equipement ajouté avec succès !");
      // Reset form
      setFormData({
        numeroDemande: "",
        dateReception: today,
        type: "",
        marque: "",
        model: "",
        numeroSerie: "",
        quantity: "",
        description: "",
        site: "",
      });
      setSelectedIdDA(null);
      setIsSansDA(false);
      navigate("/materiels");
    } catch (err) {
      if (err.response?.status === 422) {
        alert(JSON.stringify(err.response.data.errors));
      } else {
        console.error(err);
        alert("Une erreur est survenue !");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-[#343a40] p-4 rounded-lg mb-6 text-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Ajouter un matériel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ligne 1 : N° Demande + Date */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Options DA</label>

                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={isSansDA}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsSansDA(checked);
                      if (checked) {
                        setSelectedIdDA(null);
                        setFormData((prev) => ({ ...prev, numeroDemande: "" }));
                      }
                    }}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="text-sm">Sans Demande d'achat</span>
                </label>
            </div>

            <div>
                <label className="block text-sm mb-1">N° Demande d’achat</label>
              <div
                className={`flex-1 relative ${
                  isSansDA ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <CustomSelect
                  options={options}
                  placeholder="Ex: DA-001"
                  value={options.find((o) => o.value === selectedIdDA) || null}
                  onChange={(option) => {
                    setSelectedIdDA(option.value);
                    setFormData((prev) => ({
                      ...prev,
                      numeroDemande:
                        da.find((d) => d.id === option.value)?.numeroDemande ||
                        "",
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Date de réception</label>
              <input
                type="date"
                name="dateReception"
                value={formData.dateReception}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Site</label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange} // 🔹 met à jour formData
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                required
              >
                <option value="">-- Sélectionnez un site --</option>
                <option value="HITA1">HITA1</option>
                <option value="HITA2">HITA2</option>
                <option value="HITA TANA">HITA TANA</option>
              </select>
            </div>
          </div>

          {/* Ligne 2 : Type, Marque, Modèle, N° Série */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["type", "marque", "model", "numeroSerie"].map((field) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "numeroSerie" ? "text" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Ex: ${
                    field === "type"
                      ? "Ordinateur portable"
                      : field === "marque"
                      ? "Lenovo"
                      : field === "model"
                      ? "ThinkPad X1"
                      : "SN-4587-LNV-742"
                  }`}
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                  required={field === "type" || field === "model"}
                />
              </div>
            ))}
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
          <div className="text-right pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 transition px-6 py-2 rounded-md text-white font-medium flex items-center gap-2"
            >
              {loading && (
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
              )}
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutMateriel;
