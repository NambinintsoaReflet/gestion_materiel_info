import {
  FaMapMarkerAlt,
} from "react-icons/fa"; 
import { useState, useEffect } from "react";

import StatCard from "../components/StatCard";
import PendingMaintenances from "../components/PendingMaintenances";
import { api } from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState([]); // Données venant du backend
  
  const sitesData = [
    {
      id: "hita1",
      name: "HITA 1",
      dbName: "HITA1", // Le nom exact dans ta base de données
      total: 0,
      maintenance: 0,
    },
    {
      id: "hita2",
      name: "HITA 2",
      dbName: "HITA2",
      total: 0,
      maintenance: 0,
    },
    {
      id: "tana",
      name: "HITA TANA",
      dbName: "HITA TANA",
      total: 0,
      maintenance: 0,
    },
  ];

  // --- Données pour PendingMaintenances (Statiques pour le moment) ---
  const pendingMaintenancesData = [
    {
      id: 1,
      assetId: "PC-005",
      model: "Dell Optiplix",
      type: "OS Update",
      description: "Toner Refill",
      dueDate: "2024-10-27",
    },
    {
      id: 2,
      assetId: "PRN-012",
      model: "HP Lapsyjiet",
      type: "Service",
      description: "Disk Check",
      dueDate: "2024-10-28",
    },
  ];

  useEffect(() => {
    api.get("/equipements/stats-sites")
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error("Erreur stats:", err);
      });
  }, []);

  // Fonction pour récupérer le total réel calculé par le backend
  const getRealTotal = (siteDbName) => {
    const found = stats.find(s => s.site === siteDbName);
    return found ? found.total : 0;
  };

  return (
    <div className="bg-[#282c34] min-h-screen text-white">
      <div className="bg-fond p-2 rounded-md mb-4">
        <h2 className="text-md font-bold mb-2 text-[#61dafb] uppercase tracking-wider">
          DASHBOARD
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-2">
          {sitesData.map((site) => (
            <div
              key={site.id}
              className="bg-[#282c34a3] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col"
            >
              {/* En-tête du Site */}
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg shadow-inner">
                  <FaMapMarkerAlt className="text-blue-400 text-xl" />
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

              {/* Contenu : Grille interne */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-[11px] font-bold text-[#61dafb] uppercase tracking-wider mb-2 opacity-80">
                    État des matériels
                  </h3>
                  <div className="flex flex-wrap lg:grid-cols-1 gap-3">
                    <StatCard
                      title="Total"
                      // ON UTILISE ICI LA VALEUR RÉELLE DU BACKEND
                      value={getRealTotal(site.dbName)} 
                      color="green"
                    />
                    <StatCard
                      title="En maintenance"
                      value={site.maintenance} // À lier plus tard quand le backend calculera la maintenance
                      color="orange"
                    />
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
                        <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 font-medium">Encres Noir</td>
                          <td className="p-3 text-center font-bold text-orange-400">05</td>
                          <td className="p-3 text-right">
                            <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-[9px] border border-orange-500/20 uppercase">
                              Bas
                            </span>
                          </td>
                        </tr>
                        <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-3 font-medium">Piles LR6 AA</td>
                          <td className="p-3 text-center font-bold text-red-400">02</td>
                          <td className="p-3 text-right">
                            <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[9px] border border-red-500/20 uppercase font-bold">
                              Critique
                            </span>
                          </td>
                        </tr>
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
        <PendingMaintenances maintenances={pendingMaintenancesData} />
      </div>
    </div>
  );
}

export default Dashboard;