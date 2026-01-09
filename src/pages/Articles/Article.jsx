import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaPlus,
  FaBoxes,
  FaSearch,
} from "react-icons/fa";
import { api } from "../../api/axios";
import NavArticle from "./NavArticle";

const Article = () => {
  // États pour la liste
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    designation: "",
    unite: "pcs",
    stock_alerte: 5,
    emplacement: "",
  });

  // 1. Charger les articles au montage
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/articles");
      setArticles(res.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Fonction de création d'article
  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/articles", newArticle);
      setIsModalOpen(false);
      setNewArticle({
        designation: "",
        unite: "pcs",
        stock_alerte: 5,
        emplacement: "",
      });
      fetchData();
    } catch (err) {
      alert("Erreur lors de la création de l'article");
    }
  };

  // 3. Filtrage pour la recherche
  const filteredArticles = articles.filter((art) =>
    art.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white">
      {/* Barre d'actions supérieure */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 mt-4">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="w-full rounded-md py-1.5 pl-10 pr-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md py-1.5 px-3 text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all outline-none shadow-md"
        >
          <FaPlus />
          <span>Nouvel Article</span>
        </button>
      </div>

      {/* Tableau des Articles */}
      <div className="bg-[#343a40] rounded-xl border border-[#4a4f55] overflow-hidden shadow-xl">
        <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2">Désignation</th>
              <th className="p-2 text-center">Stock Actuel</th>
              <th className="p-2 text-center">Alerte</th>
              <th className="p-2">Emplacement</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4a4f55]">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    Chargement de l'inventaire...
                  </div>
                </td>
              </tr>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((art) => {
                const isAlert = art.stock_actuel <= art.stock_alerte;
                return (
                  <tr
                    key={art.id}
                   className="hover:bg-[#3d454d] transition border-b border-[#4a4f55]"
                  >
                    <td className="p-4 font-semibold text-white">
                      {art.designation}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isAlert
                            ? "bg-red-900/40 text-red-400 border border-red-500/50"
                            : "bg-green-900/30 text-green-400 border border-green-500/20"
                        }`}
                      >
                        {art.stock_actuel} {art.unite}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-400">
                      {art.stock_alerte}
                    </td>
                    <td className="p-4 text-gray-400 italic">
                      {art.emplacement || "---"}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-4">
                        {isAlert && (
                          <FaExclamationTriangle
                            className="text-yellow-500 mt-0.5 animate-pulse"
                            title="Seuil d'alerte atteint"
                          />
                        )}
                        <button className="text-blue-400 hover:text-blue-300">
                          <FaEdit />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-12 text-center text-gray-500 italic"
                >
                  Aucun article trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE CRÉATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#2d3238] w-full max-w-md rounded-2xl border border-[#4a4f55] shadow-2xl animate-in zoom-in duration-200">
            <div className="p-4 border-b border-[#4a4f55] flex justify-between items-center bg-[#343a40] rounded-t-2xl">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <FaBoxes className="text-blue-500" /> Nouvel Article
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddArticle} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">
                  Désignation *
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg focus:border-blue-500 outline-none text-white transition-all"
                  placeholder="ex: Cartouche Entretien"
                  value={newArticle.designation}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      designation: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">
                  Unité
                </label>
                <input
                  type="text"
                  className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg focus:border-blue-500 outline-none text-white"
                  placeholder="pcs, pqt, rouleau..."
                  value={newArticle.unite}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, unite: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">
                    Seuil d'alerte
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg outline-none text-white"
                    value={newArticle.stock_alerte}
                    onChange={(e) =>
                      setNewArticle({
                        ...newArticle,
                        stock_alerte: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">
                    Emplacement
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg outline-none text-white"
                    placeholder="ex: Magasin"
                    value={newArticle.emplacement}
                    onChange={(e) =>
                      setNewArticle({
                        ...newArticle,
                        emplacement: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-[#3d454d] hover:bg-gray-600 text-white font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
