import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"; // ton axios déjà configuré

const Personnel = () => {
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Charger la liste des personnels
  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const res = await api.get("/personnels");
      setPersonnel(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  // Filtrer selon recherche
  const filteredPersonnel = personnel.filter((item) =>
    [
      item.matricule,
      item.nom_personnel,
      item.prenom_personnel,
      item.service,
      item.poste,
      item.site,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Barre de recherche */}
      <div className="flex flex-wrap justify-between items-center gap-2 p-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md p-1 pl-2 outline-none border border-gray-400 text-sm"
          placeholder="Recherche..."
        />

        <button
          onClick={fetchPersonnel}
          className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-blue-500"
        >
          <FaSync /> Actualiser
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto custom-scrollbar overflow-y-auto max-h-[390px] rounded-xl border border-white/10 shadow-2xl bg-[#282c34a3] backdrop-blur-md">
        <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2">Matricule</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Prenom</th>
              <th className="p-2">Service</th>
              <th className="p-2">Poste</th>
              <th className="p-2">Site</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Email</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-3">
                  Chargement...
                </td>
              </tr>
            ) : filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#3d454d] transition duration-150 border-b border-[#4a4f55]"
                >
                  <td className="p-2 font-medium">{item.matricule}</td>
                  <td className="p-2">{item.nom_personnel}</td>
                  <td className="p-2">{item.prenom_personnel}</td>
                  <td className="p-2">{item.service}</td>
                  <td className="p-2">{item.poste}</td>
                  <td className="p-2">{item.site}</td>
                  <td className="p-2">{item.telephone}</td>
                  <td className="p-2">{item.email}</td>

                  <td className="p-2 text-right flex justify-end gap-3">
                    <FaEdit
                      size={16}
                      className="text-green-400 cursor-pointer hover:text-green-300"
                      title="Modifier"
                      onClick={() => navigate(`/personnels/edit/${item.id}`)}
                    />
                    <FaTrash
                      size={16}
                      className="text-red-400 cursor-pointer hover:text-red-300"
                      title="Supprimer"
                      onClick={() => alert("Suppression bientôt disponible")}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4 text-gray-400">
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

export default Personnel;
