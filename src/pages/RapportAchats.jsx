import React, { useEffect, useState } from "react";
import { 
  FaFileInvoiceDollar, 
  FaSearch, 
  FaCalendarAlt, 
  FaUserTie,
  FaTag
} from "react-icons/fa";
import { api } from "../api/axios";


const RapportAchats = () => {
  const [rapport, setRapport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRapport = async () => {
    try {
      setLoading(true);
      const res = await api.get("/demande-achat-items");
      setRapport(res.data);
    } catch (err) {
      console.error("Erreur rapport achats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRapport();
  }, []);

  const filteredRapport = rapport.filter((item) =>
    item.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero_da?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.demandeur && item.demandeur.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "---";
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
            <FaFileInvoiceDollar className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Suivi des Achats</h1>
            <p className="text-gray-400 text-sm font-medium">Analyse des commandes et factures</p>
          </div>
        </div>

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher DA, Article ou Demandeur..."
            className="bg-[#2d3238] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-blue-500 outline-none w-80 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLEAU */}
      <div className="bg-[#282c34] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#3d454d] text-gray-400 uppercase text-[11px] font-bold tracking-widest border-b border-gray-700">
                <th className="p-2 text-center">N° DA</th>
                <th className="p-2">Désignation</th>
                <th className="p-2 text-center">Qté</th>
                <th className="p-2 text-right">P.U</th>
                <th className="p-2">Fournisseur</th>
                <th className="p-2 text-center">N° BC</th>
                <th className="p-2">Demandeur</th>
                <th className="p-2">Date DA</th>
                 <th className="p-2">Remise</th>
                <th className="p-2 text-center">Frais Liv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr><td colSpan="9" className="py-20 text-center text-gray-500">Chargement...</td></tr>
              ) : filteredRapport.map((item, index) => (
                <tr key={index} className="hover:bg-[#343a40]/50 transition-colors group">
                  <td className="p-2 text-center font-semibold text-blue-400">
                    {item.numero_da}
                  </td>
                  <td className="p-2">
                    <div className=" text-gray-100 tracking-tight">
                      {item.libelle}
                    </div>
                  </td>
                  <td className="p-2 text-center font-mono">
                    {item.quantite}
                  </td>
                  <td className="p-2 text-right text-green-400 font-bold">
                    {formatPrice(item.prix_unitaire)} Ar
                  </td>
                  <td className="p-2 italic text-gray-400">
                    {item.fournisseur || "---"}
                  </td>
                  <td className="p-2 text-center">
                    {item.num_bc ? (
                      <span className="bg-gray-800 border border-gray-600 px-2 py-1 rounded text-xs text-white">
                        {item.num_bc}
                      </span>
                    ) : (
                      <span className="text-gray-600">---</span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2 text-xs">
                      <FaUserTie className="text-gray-600" />
                      {item.demandeur}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <FaCalendarAlt className="text-[10px]" />
                      {item.date_da}
                    </div>
                  </td>
                    <td className="p-2 text-center text-gray-500">
                    {item.remise ? `${formatPrice(item.remise)} Ar` : "0"}
                  </td>
                  <td className="p-2 text-center text-gray-500">
                    {item.frais_livraison ? `${formatPrice(item.frais_livraison)} Ar` : "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RapportAchats;