import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaHistory,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaCube,
} from "react-icons/fa";
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
      mov.article?.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.demande_achat_id?.toString().includes(searchTerm);
    const matchesSite = filterSite === "" || mov.site === filterSite;
    return matchesSearch && matchesSite;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-3.5 rounded-2xl shadow-lg shadow-green-900/20">
            <FaHistory className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Flux de Stock</h1>
            <p className="text-gray-400 text-sm font-medium">Visualisez l'activité de votre inventaire</p>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher article ou DA..."
              className="bg-[#2d3238] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-72 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-[#2d3238] rounded-xl border border-gray-700 px-4 group focus-within:border-blue-500 transition-all">
            <FaFilter className="text-gray-500 mr-3" />
            <select
              className="bg-transparent text-white py-2.5 outline-none cursor-pointer text-sm font-medium"
              value={filterSite}
              onChange={(e) => setFilterSite(e.target.value)}
            >
              <option value="">Tous les sites</option>
              <option value="HITA1">HITA 1</option>
              <option value="HITA2">HITA 2</option>
              <option value="HITA TANA">HITA TANA</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLEAU DES MOUVEMENTS */}
      <div className="bg-[#282c34] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#3d454d]/50 text-gray-400 uppercase text-[11px] font-bold tracking-widest border-b border-gray-700">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Désignation</th>
                <th className="px-6 py-4 text-center">N° DA</th>
                <th className="px-6 py-4 text-center">Site</th>
                <th className="px-6 py-4 text-center">Quantité</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium tracking-wide">Récupération des flux...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMouvements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center text-gray-500">
                      <FaCube size={40} className="mb-3 opacity-20" />
                      <p className="italic">Aucun mouvement ne correspond à votre recherche</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMouvements.map((mov) => {
                  const isEntree = mov.type.toLowerCase().includes("entrée");
                  return (
                    <tr key={mov.id} className="hover:bg-[#343a40]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-xs block">{mov.dateReception}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-100 group-hover:text-white transition-colors">
                            {mov.article?.designation || "Article inconnu"}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">ID: {mov.article?.id_article || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {mov.demande_achat_id ? (
                          <span className="bg-blue-900/20 text-blue-400 px-2.5 py-1 rounded-md border border-blue-800/30 text-[11px] font-bold">
                            DA-{mov.demande_achat_id}
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs italic">Achat Direct</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-300 font-medium">{mov.site}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-black">
                        <div className={`flex items-center justify-center gap-1 ${isEntree ? "text-green-400" : "text-red-400"}`}>
                          {isEntree ? <FaArrowDown size={10} /> : <FaArrowUp size={10} />}
                          {mov.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${
                          isEntree 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}>
                          {mov.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <button title="Modifier" className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                            <FaEdit size={14} />
                          </button>
                          <button title="Supprimer" className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <FaTrash size={14} />
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
    </div>
  );
};

export default HistoriqueMouvements;