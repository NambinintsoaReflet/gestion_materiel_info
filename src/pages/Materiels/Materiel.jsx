import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Materiel = () => {
  // Données statiques
  const materiels = [
    {
      id: 1,
      assetId: "MAT-001",
      model: "Dell Latitude 7420",
      type: "Ordinateur portable",
      description: "Portable pour usage bureautique",
      quantity: 5,
    },
    {
      id: 2,
      assetId: "MAT-002",
      model: "HP LaserJet Pro M404",
      type: "Imprimante",
      description: "Imprimante laser noir/blanc",
      quantity: 2,
    },
    {
      id: 3,
      assetId: "MAT-003",
      model: "Cisco Catalyst 2960",
      type: "Switch réseau",
      description: "Switch réseau 24 ports",
      quantity: 3,
    },
    {
      id: 4,
      assetId: "MAT-004",
      model: "Logitech MX Master 3",
      type: "Souris",
      description: "Souris sans fil ergonomique",
      quantity: 10,
    },
  ];
  return (
    <div>
      <div className="flex justify-end p-2"> 
        <input type="search" className=" rounded-md p-1 pl-2 outline-[0px] border border-gray-400 text-sm " placeholder="Recherche..." name="" id="" />
      </div>
      <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
        <thead className="bg-[#3d454d] text-left">
          <tr>
            <th className="p-2 w-1/5 min-w-[70px] font-medium">
              ID Équipement
            </th>
            <th className="p-2">Modèle</th>
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
            <th className="p-2 w-1/6 min-w-[90px] text-right">Quantité</th>
            <th className="p-2 w-20 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {materiels.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-[#3d454d] transition duration-150 border-b border-[#4a4f55]"
            >
              <td className="p-2 font-medium">{item.assetId}</td>
              <td className="p-2">{item.model}</td>
              <td className="p-2">{item.type}</td>
              <td className="p-2">{item.description}</td>
              <td className="p-2 text-right">{item.quantity}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Materiel;
