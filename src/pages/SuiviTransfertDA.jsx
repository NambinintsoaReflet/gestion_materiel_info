import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTruck,
  FaBoxOpen,
  FaWarehouse,
  FaHashtag,
  FaCheckCircle,
} from "react-icons/fa";
import { api } from "../api/axios";

const SuiviTransfertDA = () => {
  const [materielSected, setMaterielSelected] = useState([]);
  const [transferts, setTransferts] = useState([]);
  const sites = ["HITA1", "HITA2", "HITA TANA"];
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    materielId: "",
    destination: "",
    quantite: 1,
    dateTransfert: new Date().toISOString().split("T")[0],
  });

  const fetchMat = async () => {
    try {
      const res = await api.get("/demande-achat-items");
      // On récupère directement le tableau de données
      setMaterielSelected(res.data); 
    } catch (err) {
      console.error("Erreur chargement DA", err);
    }
  };

  useEffect(() => {
    fetchMat();
  }, []);

  const validerTransfert = () => {
    const article = materielSected.find(
      (m) => m.id === parseInt(formData.materielId)
    );

    if (!article) return;

    const dateAffiche = formData.dateTransfert.split("-").reverse().join("/");

    const nouveauMouvement = {
      id: Date.now(),
      date: dateAffiche,
      // On utilise libelle ici car c'est ce que tu as mis dans le select
      materiel: article.libelle || article.nom, 
      da: article.da,
      quantite: formData.quantite,
      unite: article.unite,
      destination: formData.destination,
      statut: "ENVOYÉ",
    };

    setTransferts([nouveauMouvement, ...transferts]);
    setShowModal(false);
    setFormData({
      materielId: "",
      destination: "",
      quantite: 1,
      dateTransfert: new Date().toISOString().split("T")[0],
    });
  };

  const confirmerReception = (t) => {
    const estConfirme = window.confirm(
      `Confirmez-vous la réception de : ${t.quantite} ${t.unite} de ${t.materiel} à ${t.destination} ?`
    );

    if (estConfirme) {
      setTransferts(
        transferts.map((item) =>
          item.id === t.id
            ? {
                ...item,
                statut: "RÉCEPTIONNÉ",
                dateReception:
                  new Date().toLocaleDateString("fr-FR") +
                  " à " +
                  new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
              }
            : item
        )
      );
    }
  };

  return (
    <div className="p-2">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Expéditions de Matériel
            </h1>
            <p className="text-gray-500 text-sm">
              Suivez les mouvements des transferts et confirmez les réceptions.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-600/20"
          >
            <FaPlus /> Créer un transfert
          </button>
        </div>

        {/* Tableau */}
        <div className=" border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          {transferts.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 border-b border-white/5">
                <tr>
                  <th className="p-2">Date Envoi</th>
                  <th className="p-2">Article / Référence</th>
                  <th className="p-2">Quantité</th>
                  <th className="p-2">Destination</th>
                  <th className="p-2 text-center">Statut</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transferts.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-2 text-xs text-gray-500 font-mono">{t.date}</td>
                    <td className="p-2">
                      <div className="text-white font-bold uppercase text-sm">{t.materiel}</div>
                      <div className="text-[10px] text-orange-500 font-mono italic">{t.da}</div>
                    </td>
                    <td className="p-2 font-mono text-white text-sm">
                      {t.quantite} <span className="text-[10px] text-gray-600 uppercase">{t.unite}</span>
                    </td>
                    <td className="p-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaWarehouse className="text-gray-600" size={12} /> {t.destination}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black border transition-all ${
                          t.statut === "ENVOYÉ" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                        }`}>
                          {t.statut}
                        </span>
                        {t.dateReception && <span className="text-[9px] text-gray-600 italic">Reçu le {t.dateReception}</span>}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      {t.statut === "ENVOYÉ" ? (
                        <button onClick={() => confirmerReception(t)} className="bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20 transition-all flex items-center gap-2 ml-auto shadow-sm">
                          <FaCheckCircle /> Réceptionner
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-green-500/40">
                          <span className="text-[9px] font-bold uppercase">Envoye Terminée</span>
                          <FaCheckCircle size={14} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-32 text-center">
              <FaBoxOpen size={60} className="mx-auto text-gray-800 mb-6" />
              <p className="text-gray-500 font-medium tracking-wide italic">Aucun transfert n'a été effectué aujourd'hui.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-[#1f2226] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaTruck className="text-orange-500" /> Détails de l'envoi
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">Sélectionner l'article</label>
                <select
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none text-white"
                  value={formData.materielId}
                  onChange={(e) => setFormData({ ...formData, materielId: e.target.value })}
                >
                  <option value="">-- Choisir un matériel --</option>
                  {/* FILTRAGE : Uniquement status === 1 ou "1" */}
                  {materielSected
                    .filter((m) => Number(m.status) === 1)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.libelle} ({m.unite})
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest font-mono flex items-center gap-1">
                    <FaHashtag /> Qté
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none text-white"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest font-mono">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none text-white"
                    value={formData.dateTransfert}
                    onChange={(e) => setFormData({ ...formData, dateTransfert: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest font-mono flex items-center gap-1">
                  <FaWarehouse /> Site de destination
                </label>
                <select
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none text-white"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  <option value="">-- Choisir le site --</option>
                  {sites.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowModal(false)} className="flex-1 text-gray-500 rounded-2xl hover:text-white bg-[#3d454d] font-bold transition-all uppercase text-[10px] tracking-widest">
                Annuler
              </button>
              <button
                disabled={!formData.materielId || !formData.destination || formData.quantite <= 0}
                onClick={validerTransfert}
                className={`flex-1 p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg ${
                  !formData.materielId || !formData.destination || formData.quantite <= 0
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-orange-600 text-white shadow-orange-600/20"
                }`}
              >
                Confirmer l'envoi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviTransfertDA;