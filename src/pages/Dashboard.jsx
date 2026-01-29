import { FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import PendingMaintenances from "../components/PendingMaintenances";
import { api } from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [articles, setArticles] = useState([]); // État pour les consommables

  const sitesData = [
    { id: "hita1", name: "HITA 1", dbName: "HITA1", total: 0, maintenance: 0, stockKey: "stock_hita1" },
    { id: "hita2", name: "HITA 2", dbName: "HITA2", total: 0, maintenance: 0, stockKey: "stock_hita2" },
    { id: "tana", name: "HITA TANA", dbName: "HITA TANA", total: 0, maintenance: 0, stockKey: "stock_tana" },
  ];

  // const pendingMaintenancesData = [
    // { id: 1, assetId: "PC-005", model: "Dell Optiplix", type: "OS Update", description: "Toner Refill", dueDate: "2024-10-27" },
    // { id: 2, assetId: "PRN-012", model: "HP Lapsyjiet", type: "Service", description: "Disk Check", dueDate: "2024-10-28" },
  // ];

  useEffect(() => {
    // 1. Récupérer les stats des équipements
    api.get("/equipements/stats-sites")
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error("Erreur stats:", err));

    // 2. Récupérer les articles pour les consommables critiques
    api.get("/articles")
      .then((res) => setArticles(res.data))
      .catch((err) => console.error("Erreur articles:", err));
  }, []);

  const getRealTotal = (siteDbName) => {
    const found = stats.find(s => s.site === siteDbName);
    return found ? found.total : 0;
  };

  // --- LOGIQUE POUR LES 3 PLUS CRITIQUES ---
  const getCriticalArticles = (siteStockKey) => {
    return articles
      .filter(art => art[siteStockKey] <= art.stock_min) // Uniquement ceux sous le seuil
      .sort((a, b) => a[siteStockKey] - b[siteStockKey]) // Les plus petits stocks en premier
      .slice(0, 3); // Top 3
  };

  return (
    <div className="bg-[#282c34] min-h-screen text-white">
      <div className="bg-fond p-2 rounded-md ">
        <h2 className="text-md font-bold p-2 text-[#61dafb] uppercase tracking-wider">
          DASHBOARD
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-2">
          {sitesData.map((site) => (
            <div
              key={site.id}
              className="bg-[#282c34a3] backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg shadow-inner">
                  <FaMapMarkerAlt className={`text-blue-400 text-xl ${site.id === "hita1" ? "text-blue-400" : site.id === "hita2" ? "text-green-400" : "text-purple-400"}`} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                    {site.name}
                  </h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                    Localisation du site
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-[11px] font-bold text-[#61dafb] uppercase tracking-wider mb-2 opacity-80">
                    État des matériels
                  </h3>
                  <div className="flex flex-wrap lg:grid-cols-1 gap-3">
                    <StatCard title="Total" value={getRealTotal(site.dbName)} color="green" />
                    <StatCard title="En maintenance" value={site.maintenance} color="orange" />
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <h3 className="text-[11px] font-bold text-[#61dafb] uppercase tracking-wider mb-2 opacity-80">
                    Consommables Critiques
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-white/5 text-[10px] uppercase text-gray-400">
                        <tr>
                          <th className="p-3 font-semibold">Article</th>
                          <th className="p-3 text-center">Stock</th>
                          <th className="p-3 text-right">Etat</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] text-gray-200">
                        {getCriticalArticles(site.stockKey).length > 0 ? (
                          getCriticalArticles(site.stockKey).map((art) => (
                            <tr key={art.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-3 font-medium">{art.designation}</td>
                              <td className={`p-3 text-center font-bold ${art[site.stockKey] === 0 ? 'text-red-500' : 'text-orange-400'}`}>
                                {String(art[site.stockKey]).padStart(2, '0')}
                              </td>
                              <td className="p-3 text-right">
                                <span className={`${
                                  art[site.stockKey] === 0 
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                  : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                } px-2 py-0.5 rounded text-[9px] border uppercase font-bold`}>
                                  {art[site.stockKey] === 0 ? 'Rupture' : 'Critique'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="p-3 text-center text-gray-500 italic text-[10px]">
                              Aucun article en alerte
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#20232a] p-4 rounded-md">
        {/* <PendingMaintenances maintenances={pendingMaintenancesData} /> */}
      </div>
    </div>
  );
}

export default Dashboard;