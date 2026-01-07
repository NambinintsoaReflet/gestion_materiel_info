import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";

const AjoutPersonnel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    matricule: "",
    nom_personnel: "",
    prenom_personnel: "",
    fonction_personnel: "",
    service: "",
    poste: "",
    site: "",
    telephone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATIONS obligatoires
    if (
      !formData.nom_personnel.trim() ||
      !formData.prenom_personnel.trim() ||
      !formData.fonction_personnel.trim() ||
      !formData.site
    ) {
      alert("Veuillez remplir Nom, Prénom, Fonction et Site.");
      return;
    }

    setLoading(true);

    console.log("📌 Nouvelle saisie personnel :", formData);

    try {
      const res = await api.post("/personnels", formData);
      alert("Personnel ajouté avec succès !");
      navigate("/personnel");
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
          <FaPlus /> Ajouter un Personnel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ligne 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Matricule</label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Ex: HITA-025"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Nom</label>
              <input
                type="text"
                name="nom_personnel"
                value={formData.nom_personnel}
                onChange={handleChange}
                placeholder="Ex: Rakoto"
                required
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Prénom</label>
              <input
                type="text"
                name="prenom_personnel"
                value={formData.prenom_personnel}
                onChange={handleChange}
                placeholder="Ex: Mamy"
                required
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Site</label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
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

          {/* Ligne 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Fonction</label>
              <input
                type="text"
                name="fonction_personnel"
                value={formData.fonction_personnel}
                onChange={handleChange}
                placeholder="Ex: Technicien informatique"
                required
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Service</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="Ex: Informatique"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Poste</label>
              <input
                type="text"
                name="poste"
                value={formData.poste}
                onChange={handleChange}
                placeholder="Ex: Support IT"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Téléphone</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Ex: 0341234567"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Ligne 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: mamy.rakoto@hita.mg"
                className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Bouton */}
          <div className="text-right flex justify-end pt-2 gap-2">
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

export default AjoutPersonnel;
