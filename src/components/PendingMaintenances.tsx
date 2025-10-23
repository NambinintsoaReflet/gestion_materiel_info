import React from "react";
import { FaCalendarAlt } from "react-icons/fa"; // Icône de calendrier pour l'action

// --- Données de Démonstration ---
const demoMaintenances = [
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

// --- Composant Fonctionnel ---
const PendingMaintenances = ({ maintenances = [] }) => {
  const currentMaintenances =
    maintenances.length > 0 ? maintenances : demoMaintenances;

  return (
    <div className="bg-[#282c34] p-5 rounded-lg shadow-lg text-white">
      <h2 className="text-md font-medium mb-4 text-gray-200">
        Achats (en Attente)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2 w-1/5 min-w-[70px] font-medium">
                ID Équipement
              </th>
              <th className="p-2">Modèle</th>
              <th className="p-2">Type</th>
              <th className="p-2">Description</th>
              <th className="p-2 w-1/6 min-w-[90px] text-right">Date prévue</th>
              <th className="p-2 w-10 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentMaintenances.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#3d454d] transition duration-150 border-b border-[#4a4f55]"
              >
                <td className="p-2 font-medium">{item.assetId}</td>
                <td className="p-2">{item.model}</td>
                <td className="p-2">{item.type}</td>
                <td className="p-2">{item.description}</td>
                <td className="p-2 text-right">{item.dueDate}</td>
                <td className="p-2 text-right">
                  <FaCalendarAlt
                    size={16}
                    className="text-blue-400 cursor-pointer hover:text-blue-300 transition"
                    title="Ouvrir la maintenance"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingMaintenances;
