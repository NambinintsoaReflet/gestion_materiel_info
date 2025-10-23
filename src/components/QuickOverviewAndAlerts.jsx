import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaClock, FaFire } from "react-icons/fa";

// Enregistrement des éléments nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Données de Démonstration ---
const demoOverviewData = [
  { label: "Disponible", count: 55, percentage: 5, color: "#1e90ff" }, // Bleu
  { label: "Utilisé", count: 840, percentage: 84, color: "#ffa500" }, // Orange
  { label: "Maintenance", count: 15, percentage: 5, color: "#32cd32" }, // Vert
  { label: "Réformé", count: 0, percentage: 6, color: "#dc3545" }, // Rouge
];

// --- Fonctions de mise en forme pour Chart.js ---
const getChartData = (data) => ({
  labels: data.map((item) => item.label),
  datasets: [
    {
      data: data.map((item) => item.percentage),
      backgroundColor: data.map((item) => item.color),
      borderColor: "#282c34", // Couleur de bordure pour séparer les segments
      borderWidth: 2,
    },
  ],
});

// Options du graphique
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const item = demoOverviewData[context.dataIndex];
          return `${item.label}: ${item.count} (${item.percentage}%)`;
        },
      },
    },
  },
};

// --- Composant Principal ---
const QuickOverviewAndAlerts = ({ overviewData = [], alerts = [] }) => {
  const currentOverviewData =
    overviewData.length > 0 ? overviewData : demoOverviewData;
  const chartData = getChartData(currentOverviewData);

  return (
    <div className="flex flex-col lg:flex-row gap-5 text-white">
      {/* --- SECTION APERÇU RAPIDE (GAUCHE) --- */}
      <div className="flex-1 bg-[#282c34] p-5 rounded-lg shadow-lg">
        <h2 className="text-md font-medium mb-5 text-gray-200">
          Tableau de bord rapide
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Graphique Doughnut */}
          <div className="w-40 h-40 flex-shrink-0">
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          {/* Légende du Graphique */}
          <div className="flex-grow">
            {currentOverviewData.map((item, index) => (
              <div key={index} className="flex items-center mb-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-300">{item.label}: </span>
                <span className="font-medium ml-1">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SECTION ALERTES RÉCENTES (DROITE) --- */}
      <div className="flex-1 bg-[#282c34] p-5 rounded-lg shadow-lg">
        <h2 className="text-md font-medium mb-5 text-gray-200">
          Alertes Récentes
        </h2>
        <ul className="space-y-4">
          {/* Alerte Exemple 1 */}
          <li className="flex items-start">
            <span className="text-xl mr-4 flex-shrink-0 text-orange-400">
              <FaClock />
            </span>
            <div className="flex flex-col">
              <p className="font-medium text-gray-100">
               HP LaserJet Pro M404 - La garantie expire dans
              </p>
              <span className="text-sm text-gray-400">
                (Garantie expire dans 30 jours)
              </span>
            </div>
          </li>

          {/* Alerte Exemple 2 */}
          <li className="flex items-start">
            <span className="text-xl mr-4 flex-shrink-0 text-red-500">
              <FaFire />
            </span>
            <div className="flex flex-col">
              <p className="font-medium text-gray-100">
                Onduleur - Avertissement de surchauffe
              </p>
              <span className="text-sm text-gray-400">(Surchauffe détectée)</span>
            </div>
          </li>

          {/* ... autres alertes ... */}
        </ul>
      </div>
    </div>
  );
};

export default QuickOverviewAndAlerts;
