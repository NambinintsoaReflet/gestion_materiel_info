import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSync } from "react-icons/fa";
import { api } from "../../api/axios";

const Achat = () => {
  const [search, setSearch] = useState("");
  const [etatFilter, setEtatFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

    // GET EQUIPEMENTS
    const fetchDA = async () => {
      // try {
      //   setLoading(true);
      //   const { data } = await api.get("/achat");
  
      //   // setPublications(normalizePublications(data));
      //   setEquipement(data);
      //   console.log("equipements :", data);
      // } catch (err) {
      //   console.error(err); // trace l’erreur en console
      //   setError("Erreur lors du chargement des événements."); // affiche un message utilisateur
      // } finally {
      //   setLoading(false); // désactive le loader quoi qu’il arrive (succès ou erreur)
      // }
    };
  
    useEffect(() => {
      fetchDA();
    }, []);

  const achats = [
    // { id: 1, numeroDemande: "DA-001", dateDemande: "2025-10-25", description: "Dell Latitude 7420 pour usage bureautique", etat: "En cours" },
    // { id: 2, numeroDemande: "DA-002", dateDemande: "2025-10-20", description: "HP LaserJet Pro M404", etat: "Livre" },
    // { id: 3, numeroDemande: "DA-003", dateDemande: "2025-10-18", description: "Cisco Catalyst 2960", etat: "En attente" },
    // { id: 4, numeroDemande: "DA-004", dateDemande: "2025-10-15", description: "Logitech MX Master 3", etat: "Annule" },
  ];

  const etatBadge = (etat) => {
    switch (etat) {
      case "En cours": return "bg-yellow-400 text-black";
      case "Livre": return "bg-green-500 text-white";
      case "En attente": return "bg-blue-400 text-white";
      case "Annule": return "bg-red-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const filteredAchats = achats.filter((item) => {
    const matchesSearch =
      item.numeroDemande.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesEtat = etatFilter === "" || item.etat === etatFilter;
    const matchesDate = dateFilter === "" || item.dateDemande === dateFilter;
    return matchesSearch && matchesEtat && matchesDate;
  });

  const resetFilters = () => {
    setSearch("");
    setEtatFilter("");
    setDateFilter("");
  };

  return (
    <div>
      <div className="flex flex-wrap justify-end items-center gap-2 p-2">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md p-1 pl-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        />
        <select
          value={etatFilter}
          onChange={(e) => setEtatFilter(e.target.value)}
          className="rounded-md p-1 pl-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        >
          <option value="">-- État --</option>
          <option value="En cours">En cours</option>
          <option value="Livre">Livré</option>
          <option value="En attente">En attente</option>
          <option value="Annule">Annulé</option>
        </select>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md p-1 pl-2 outline-[0px] border border-gray-400 text-sm"
          placeholder="Recherche..."
        />
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 cursor-pointer rounded-md p-1 pl-2 hover:bg-[#314254] border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none"
        >
          <FaSync /> Rafraîchir
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2 w-1/5 min-w-[70px] font-medium">ID DA</th>
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">État</th>
              <th className="p-2 w-20 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAchats.length > 0 ? (
              filteredAchats.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#3d454d] transition duration-150 border-b border-[#4a4f55]"
                >
                  <td className="p-2 font-medium">{item.numeroDemande}</td>
                  <td className="p-2">{item.dateDemande}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${etatBadge(item.etat)}`}
                    >
                      {item.etat.replace("_", " ")}
                    </span>
                  </td>
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
                <td colSpan={5} className="text-center p-4 text-gray-400">
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

export default Achat;
