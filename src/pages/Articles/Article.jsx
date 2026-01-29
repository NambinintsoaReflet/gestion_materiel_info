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

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // État du modal avec id_article inclus
  const [newArticle, setNewArticle] = useState({
    id_article: "", 
    designation: "",
    unite: "pcs",
    stock_min: 5,
    stock_hita1: 0,
    stock_hita2: 0,
    stock_tana: 0,
  });

  // 1. Récupération automatique du prochain numéro d'article
  const fetchNextArticleNumber = async () => {
    try {
      const res = await api.get("/article/next-number"); // Correction du guillemet en trop
      setNewArticle((prev) => ({
        ...prev,
        id_article: res.data.numeroArticle, // On utilise la donnée reçue pour id_article
      }));
    } catch (error) {
      console.error("Erreur génération ID Article :", error);
    }
  };

  // Charger le numéro quand on ouvre le modal
  useEffect(() => {
    if (isModalOpen) {
      fetchNextArticleNumber();
    }
  }, [isModalOpen]);

  // 2. Charger la liste des articles
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

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/articles", newArticle);
      console.log("🚀 Nouvel Article :", newArticle);
      setIsModalOpen(false); // Fermer après succès
      setNewArticle({
        id_article: "",
        designation: "",
        unite: "pcs",
        stock_min: 5,
        stock_hita1: 0,
        stock_hita2: 0,
        stock_tana: 0,
      });
      fetchData();
    } catch (err) {
      console.log(err)
      alert("Erreur lors de la création de l'article");
    }
  };

  const filteredArticles = articles.filter((art) =>
    art.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.id_article?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white">
      {/* Barre d'actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 mt-4">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un article ou ID..."
            className="w-full rounded-md py-1.5 pl-10 pr-2 border border-gray-400 text-sm bg-[#343a40] text-gray-200 outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md py-1.5 px-3 text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md"
        >
          <FaPlus />
          <span>Nouvel Article</span>
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-[#343a40] rounded-xl border border-[#4a4f55] overflow-hidden shadow-xl">
        <table className="w-full text-sm text-gray-300 bg-[#343a40]">
          <thead className="bg-[#3d454d] text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Désignation</th>
              <th className="p-2 text-center">HITA 1</th>
              <th className="p-2 text-center">HITA 2</th>
              <th className="p-2 text-center">TANA</th>
              <th className="p-2 text-center">Alerte</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4a4f55]">
            {loading ? (
              <tr><td colSpan="7" className="p-12 text-center">Chargement...</td></tr>
            ) : filteredArticles.map((art) => {
              const totalStock = (art.stock_hita1 || 0) + (art.stock_hita2 || 0) + (art.stock_tana || 0);
              const isAlert = totalStock <= art.stock_min;
              
              return (
                <tr key={art.id} className="hover:bg-[#3d454d] transition border-b border-[#4a4f55]">
                  <td className="p-2 font-mono text-blue-400 text-xs">{art.id_article}</td>
                  <td className="p-2 text-white">{art.designation}</td>
                  <td className="p-2 text-center font-bold">{art.stock_hita1 || 0}</td>
                  <td className="p-2 text-center font-bold">{art.stock_hita2 || 0}</td>
                  <td className="p-2 text-center font-bold">{art.stock_tana || 0}</td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${isAlert ? "bg-red-900/40 text-red-400" : "text-gray-500"}`}>
                      {art.stock_min}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-3">
                      {isAlert && <FaExclamationTriangle className="text-yellow-500 animate-pulse" />}
                      <button className="text-blue-400 hover:text-blue-200"><FaEdit /></button>
                      <button className="text-red-400 hover:text-red-200"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (GARDÉ ORIGINAL MAIS CORRIGÉ) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#2d3238] w-full max-w-md rounded-2xl border border-[#4a4f55] shadow-2xl">
            <div className="p-4 border-b border-[#4a4f55] flex justify-between items-center bg-[#343a40] rounded-t-2xl">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <FaBoxes className="text-blue-500" /> Nouvel Article
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddArticle} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">ID Article</label>
                  <input
                    type="text" disabled
                    className="w-full bg-[#1e2227] border border-[#4a4f55] p-2.5 rounded-lg text-blue-400 font-mono text-xs cursor-not-allowed"
                    value={newArticle.id_article}
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">Unité</label>
                  <input
                    type="text"
                    className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg text-white outline-none focus:border-blue-500"
                    value={newArticle.unite}
                    onChange={(e) => setNewArticle({ ...newArticle, unite: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">Désignation *</label>
                <input
                  type="text" required
                  className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg text-white outline-none focus:border-blue-500"
                  value={newArticle.designation}
                  onChange={(e) => setNewArticle({ ...newArticle, designation: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase text-gray-500 font-bold mb-1 block">Seuil d'alerte</label>
                  <input
                    type="number"
                    className="w-full bg-[#3d454d] border border-[#4a4f55] p-2.5 rounded-lg text-white outline-none focus:border-blue-500"
                    value={newArticle.stock_min}
                    onChange={(e) => setNewArticle({ ...newArticle, stock_min: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-[#3d454d] hover:bg-gray-600 transition-colors">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold shadow-lg transition-all text-white">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;