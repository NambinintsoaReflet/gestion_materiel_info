import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaHistory, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../api/axios";

const HistoriqueMouvements = () => {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSite, setFilterSite] = useState("");

  const fetchMouvements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/mouvement-articles");
      setMouvements(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des mouvements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMouvements();
  }, []);

  const filteredMouvements = mouvements.filter((mov) => {
    const matchesSearch =
      mov.article?.designation
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mov.demande_achat_id?.toString().includes(searchTerm);
    const matchesSite = filterSite === "" || mov.site === filterSite;
    return matchesSearch && matchesSite;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-3 rounded-lg shadow-lg">
            <FaHistory className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Flux de Stock</h1>
            <p className="text-gray-400 text-sm">
              Historique des entrées et mouvements
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </div>

      {/* TABLEAU */}
      <div className="bg-[#282c34] rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
        <table className="w-full text-sm text-gray-300 bg-[#343a40]">
          <thead className="bg-[#3d454d] text-left text-gray-400 uppercase text-xs font-bold">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2 text-center">ID</th>
              <th className="p-2">Désignation</th>
              <th className="p-2 text-center">N° DA</th>
              <th className="p-2 text-center">Site</th>
              <th className="p-2 text-center">Quantité</th>
              <th className="p-2 text-center">Type</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-12 text-center text-gray-500 text-center"
                >
                  Chargement...
                </td>
              </tr>
            ) : (
              filteredMouvements.map((mov) => {
                // Détection du type pour la couleur et le signe
                const isSortie = mov.type.toLowerCase().includes("sortie");

                return (
                  <tr
                    key={mov.id}
                    className="hover:bg-[#3d454d] transition-colors group"
                  >
                    <td className="p-2 font-mono text-xs">
                      {mov.dateReception}
                    </td>
                    <td className="p-2 text-center">
                      {mov.article?.id_article}
                    </td>
                    <td className="p-2 font-bold text-white">
                      {mov.article?.designation}
                    </td>
                    <td className="p-2 text-center italic text-gray-500">
                      {mov.demande_achat_id
                        ? `DA-${mov.demande_achat_id}`
                        : "Sans DA"}
                    </td>
                    <td className="p-2 text-center">{mov.site}</td>

                    {/* QUANTITÉ : Dynamique selon Entrée/Sortie */}
                    <td
                      className={`p-2 text-center font-bold ${isSortie ? "text-red-400" : "text-green-400"}`}
                    >
                      {isSortie ? `-${mov.quantity}` : `+${mov.quantity}`}
                    </td>

                    {/* TYPE : Dynamique selon Entrée/Sortie */}
                    <td className="p-2 text-center">
                      <span
                        className={`text-[10px] uppercase px-2 py-1 rounded-full border ${
                          isSortie
                            ? "bg-red-900/30 text-red-500 border-red-800"
                            : "bg-green-900/30 text-green-500 border-green-800"
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>

                    <td className="p-2">
                      <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-blue-400 hover:text-blue-300">
                          <FaEdit />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoriqueMouvements;
