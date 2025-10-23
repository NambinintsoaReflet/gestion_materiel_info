import {
  FaExclamationTriangle,
  FaLaptop,
  FaTools,
  FaUsers,
  FaClock,
  FaFire,
  FaInfoCircle,
  FaBatteryThreeQuarters,
} from "react-icons/fa"; // Assurez-vous d'importer toutes les icônes nécessaires

import StatCard from "../components/StatCard";
import QuickOverviewAndAlerts from "../components/QuickOverviewAndAlerts";
import PendingMaintenances from "../components/PendingMaintenances";

function Dashboard() {

  const overviewChartData = [
    {
      label: "Disponible",
      count: 4,
      percentage: 100,
      color: "#1e90ff",
    },
    { label: "Utilisé", count: 4, percentage: 100, color: "#ffa500" },
    { label: "Maintenance", count: 0, percentage: 0, color: "#32cd32" },
    { label: "Réformé", count: 0, percentage: 0, color: "#dc3545" },
  ];

  const alertsData = [
    {
      id: 1,
      message: "ProDesk 500 G5 - Warranty expires in",
      details: "(Garantie expire dans 30 jours)",
      icon: <FaClock />,
      iconColor: "text-orange-400",
    },
    {
      id: 2,
      message: "Server Rack 3 - Overheating warning",
      details: "(Surchauffe détectée)",
      icon: <FaFire />,
      iconColor: "text-red-500",
    },
    {
      id: 3,
      message: "Monitor Dell U2721Q - Driver update",
      details: "(Mise à jour pilote disponible)",
      icon: <FaInfoCircle />,
      iconColor: "text-blue-400",
    },
    {
      id: 4,
      message: "Laptop HP Spectre - Battery replacement due",
      details: "(Remplacement batterie)",
      icon: <FaBatteryThreeQuarters />,
      iconColor: "text-yellow-500",
    },
  ];

  // --- Données pour PendingMaintenances ---
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

  return (
    <div className="bg-[#282c34] min-h-screen text-white">
      <div className="bg-[#20232a] p-4 rounded-md mb-6">
        <h2 className="text-md font-medium mb-4 text-white">
          GESTION DU MATERIEL INFORMATIQUE
        </h2>
        <div className="flex justify-between flex-wrap gap-4">
          <StatCard
            title="Total des équipements"
            value="4"
            icon={<FaLaptop />}
            color="green"
          />
          <StatCard
            title="En utilisation"
            value="4"
            icon={<FaUsers />}
            color="blue"
          />
          <StatCard
            title="En maintenance"
            value="0"
            icon={<FaTools />}
            color="orange"
          />
          <StatCard
            title="Stock bas"
            value="0"
            icon={<FaExclamationTriangle />}
            color="red"
          />
        </div>
      </div>
      {/* Section Quick Overview et Alertes Récentes */}
      <div className="bg-[#20232a] p-4 rounded-md mb-6">
        {/* Ajout de mb-6 pour l'espace */}
        <QuickOverviewAndAlerts
          overviewData={overviewChartData}
          alerts={alertsData}
        />
      </div>
      {/* NOUVELLE SECTION : Maintenances en Attente */}
      <div className="bg-[#20232a] p-4 rounded-md">
        {/* Utiliser la même couleur de fond pour la cohérence */}
        <PendingMaintenances maintenances={pendingMaintenancesData} />
      </div>
    </div>
  );
}

export default Dashboard;
