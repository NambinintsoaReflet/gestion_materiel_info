import React, { useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Chargement from "../../components/Chargement";

const Achat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ================= STATE ================= */
  const [das, setDas] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

  /* ================= FETCH DA ================= */
  const fetchDA = async () => {
    try {
      setLoading(true);
      const res = await api.get("/da/list-da").finally(() => setLoading(false));
      setDas(res.data);
    } catch (err) {
      console.error("Erreur chargement DA", err);
    }
  };

  useEffect(() => {
    fetchDA();
  }, []);

  /* ================= LOGIQUE PROGRESSION ================= */
  const calculateProgress = (items) => {
    if (!items || items.length === 0) return 0;
    // Un article est considéré "traité" s'il est acheté (status 1) ou refusé (status 2)
    const treatedItems = items.filter(
      (item) => Number(item.status) === 1 || Number(item.status) === 2
    ).length;
    return Math.round((treatedItems / items.length) * 100);
  };

  /* ================= FILTER ================= */
  const filteredDas = das.filter((da) => {
    const matchesSearch =
      da.numero_da.toLowerCase().includes(search.toLowerCase()) ||
      da.demandeur.toLowerCase().includes(search.toLowerCase()) ||
      da.site.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter === "" || da.date_reception === dateFilter;
    const matchesSite = siteFilter === "" || da.site === siteFilter;

    return matchesSearch && matchesDate && matchesSite;
  });

  const resetFilters = () => {
    setSearch("");
    setDateFilter("");
    setSiteFilter("");
  };

  return (
    <div className="p-2">
      {/* FILTRES */}
      <div className="flex flex-wrap justify-end items-center gap-2 mb-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md p-1 px-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        />

        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="rounded-md p-1 px-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        >
          <option value="">-- Site --</option>
          <option value="HITA1">HITA1</option>
          <option value="HITA2">HITA2</option>
          <option value="HITA TANA">HITA TANA</option>
        </select>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md p-1 px-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
          placeholder="Recherche (DA, site, demandeur)"
        />

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 rounded-md p-1 px-3 border border-gray-400 text-sm bg-[#343a40] text-gray-200 hover:bg-[#314254]"
        >
          <FaSync /> Réinitialiser
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto custom-scrollbar overflow-y-auto max-h-[390px] rounded-xl border border-white/10 shadow-2xl bg-[#282c34a3] backdrop-blur-md">
        <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2">N° DA</th>
              <th className="p-2">Date</th>
              <th className="p-2">Site</th>
              <th className="p-2">Demandeur</th>
              <th className="p-2 w-48">
                Status / Progression
              </th>
              <th className="p-2 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              /* État de chargement : On affiche une ligne qui occupe toute la largeur */
            <tr>
                <td colSpan="6" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    Chargement de l'inventaire...
                  </div>
                </td>
              </tr>
            ) : filteredDas.length > 0 ? (
              /* Si des données existent, on les affiche */
              filteredDas.map((da) => {
                const percentage = calculateProgress(da.items);
                return (
                  <tr
                    key={da.id}
                    className="hover:bg-[#3d454d] transition border-b border-[#4a4f55]"
                  >
                    <td className="p-2 font-medium">{da.numero_da}</td>
                    <td className="p-2">{da.date_da}</td>
                    <td className="p-2">{da.site}</td>
                    <td className="p-2">{da.demandeur}</td>
                    <td className="p-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span
                            className={
                              percentage === 100
                                ? "text-green-400"
                                : "text-orange-400"
                            }
                          >
                            {percentage === 100 ? "Terminé" : "En cours"}
                          </span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              percentage === 100
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => navigate(`/achat/${da.id}`)}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-xs transition-colors shadow-sm"
                      >
                        Gérer
                      </button>
                      <button
                        onClick={() => navigate(`/achat/${da.id}/imprimer`)}
                        className="ml-2 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white text-xs transition-colors shadow-sm"
                      >
                        Voir / Imprimer
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Si le chargement est fini mais qu'il n'y a aucune donnée */
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-400 italic"
                >
                  Aucune demande d'achat trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Achat;
