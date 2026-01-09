import React, { useEffect, useState } from "react";
import { FaEdit, FaSync, FaTrash } from "react-icons/fa";
import { api } from "../../api/axios";
import Chargement from "../../components/Chargement";

const Materiel = () => {
  const [equipement, setEquipement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres
  const [filterSite, setFilterSite] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /** 🔍 Filtrage dynamique */
  const filteredEquipements = equipement.filter((item) => {
    if (filterSite && item.site !== filterSite) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        (item.demandeAchat?.numeroDemande?.toLowerCase().includes(term) ?? false) ||
        (item.type?.toLowerCase().includes(term) ?? false) ||
        (item.marque?.toLowerCase().includes(term) ?? false) ||
        (item.model?.toLowerCase().includes(term) ?? false) ||
        (item.description?.toLowerCase().includes(term) ?? false);

      if (!match) return false;
    }

    return true;
  });

  /** 🔄 Charger les équipements */
  const fetchEquipement = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/equipements");
      setEquipement(data.data || []);
      console.log("📦 Équipements chargés :", data.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des équipements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipement();
  }, []);

  /** 🔁 Bouton rafraîchir */
  const handleRefresh = () => {
    fetchEquipement();
    setFilterSite("");
    setSearchTerm("");
  };

  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div>
      {/* Filtres */}
      <div className="flex justify-end p-2 gap-2">
        <select
          value={filterSite}
          onChange={(e) => setFilterSite(e.target.value)}
          className="rounded-md p-1 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        >
          <option value="">-- Tous --</option>
          <option value="HITA1">HITA1</option>
          <option value="HITA2">HITA2</option>
          <option value="HITA TANA">HITA TANA</option>
        </select>

        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md p-1 pl-2 border border-gray-400 text-sm"
          placeholder="Recherche..."
        />

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 rounded-md p-1 px-2 hover:bg-[#314254] border border-gray-400 text-sm bg-[#343a40] text-gray-200"
        >
          <FaSync className={loading ? "animate-spin" : ""} /> Rafraîchir
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">DA</th>
              <th className="p-2">Type</th>
              <th className="p-2">Marque</th>
              <th className="p-2">Modèle</th>
              <th className="p-2">Description</th>
              <th className="p-2">Site</th>
              <th className="p-2 text-right">Quantité</th>
              <th className="p-2">Utilisateur</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    Chargement de l'inventaire...
                  </div>
                </td>
              </tr>
            ) : filteredEquipements.length > 0 ? (
              filteredEquipements.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#3d454d] transition border-b border-[#4a4f55]"
                >
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">
                    {item.demandeAchat?.numeroDemande ?? "Sans DA"}
                  </td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.marque}</td>
                  <td className="p-2">{item.model}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.site}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2">{item.user?.name ?? "-"}</td>
                  <td className="p-2 text-right flex justify-end gap-2">
                    <FaEdit
                      size={16}
                      className="text-green-400 cursor-pointer hover:text-green-300"
                      title="Modifier"
                    />
                    <FaTrash
                      size={16}
                      className="text-red-400 cursor-pointer hover:text-red-300"
                      title="Supprimer"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-400">
                  Aucun résultat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Materiel;