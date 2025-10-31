import React, { useEffect, useState } from "react";
import { FaEdit, FaSync, FaTrash } from "react-icons/fa";
import { api } from "../../api/axios";
import Chargement from "../../components/Chargement";

const Materiel = () => {
  const [equipement, setEquipement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //filtre
  const [filterSite, setFilterSite] = useState(""); // filtre par site
  const [searchTerm, setSearchTerm] = useState(""); // filtre par recherche

  const filteredEquipements = equipement.filter((item) => {
    // 🔹 filtre site si sélectionné
    if (filterSite && item.site !== filterSite) return false;

    // 🔹 filtre recherche (DA, type, marque, modèle, description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        (item.numeroDemande?.toLowerCase().includes(term) ?? false) ||
        (item.type?.toLowerCase().includes(term) ?? false) ||
        (item.marque?.toLowerCase().includes(term) ?? false) ||
        (item.model?.toLowerCase().includes(term) ?? false) ||
        (item.description?.toLowerCase().includes(term) ?? false);
      if (!match) return false;
    }

    return true;
  });

  // GET EQUIPEMENTS
  const fetchEquipement = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/equipements");

      // setPublications(normalizePublications(data));
      setEquipement(data);
      console.log("equipements :", data);
    } catch (err) {
      console.error(err); // trace l’erreur en console
      setError("Erreur lors du chargement des événements."); // affiche un message utilisateur
    } finally {
      setLoading(false); // désactive le loader quoi qu’il arrive (succès ou erreur)
    }
  };

  useEffect(() => {
    fetchEquipement();
  }, []);

  //Rafraichir
  const handleRefresh = () => {
    fetchEquipement(); // 🔹 recharge la liste depuis l'API
    setFilterSite(""); // 🔹 reset filtre site
    setSearchTerm(""); // 🔹 reset recherche
  };

  // 🌀 États intermédiaires de rendu
  if (loading) return <Chargement />; // si en cours de chargement, affiche le loader
  if (error) return <p className="error-message">{error}</p>; // si erreur, affiche le message

  return (
    <div>
      <div className="flex justify-end p-2 gap-2">
        <select
          value={filterSite}
          onChange={(e) => setFilterSite(e.target.value)}
          className="rounded-md p-1 pl-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        >
          <option value="">-- tout --</option>
          <option value="HITA1">HITA1</option>
          <option value="HITA2">HITA2</option>
          <option value="HITA TANA">HITA TANA</option>
        </select>

        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md p-1 pl-2 outline-[0px] border border-gray-400 text-sm"
          placeholder="Recherche..."
        />

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 cursor-pointer rounded-md p-1 pl-2 hover:bg-[#314254] border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        >
          <FaSync /> Rafraîchir
        </button>
      </div>

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
              <td className="p-2">Sites</td>
              <th className="p-2 w-1/6 min-w-[90px] text-right">Quantité</th>
              <th className="p-2">User</th>
              <th className="p-2 w-20 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEquipements.length > 0 ? (
              filteredEquipements.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#3d454d] transition duration-150 border-b border-[#4a4f55]"
                >
                  <td className="p-2 font-medium">{item.id}</td>
                  <td className="p-2 font-medium">{item.numeroDemande}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.marque}</td>
                  <td className="p-2">{item.model}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.site}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">{item.user.name}</td>
                  <td className="p-2 text-right flex justify-end gap-2">
                    <FaEdit
                      size={16}
                      className="text-green-400 cursor-pointer hover:text-green-300 transition"
                      title="Modifier"
                    />
                    <FaTrash
                      size={16}
                      className="text-red-400 cursor-pointer hover:text-red-300 transition"
                      title="Supprimer"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-400">
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
