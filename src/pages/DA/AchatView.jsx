import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Chargement from "../../components/Chargement";
import {
  FaMapMarkerAlt,
  FaLaptop,
  FaTools,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const AchatView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [da, setDa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lockedItemIds, setLockedItemIds] = useState([]);

  useEffect(() => {
    api.get(`/da/${id}`).then((res) => {
      setDa(res.data);
      const locked = res.data.items
        .filter((item) => item.status !== 0)
        .map((item) => item.id);
      setLockedItemIds(locked);
    });
  }, [id]);

  const handleChangeStatus = (index, newStatus) => {
    if (lockedItemIds.includes(da.items[index].id)) return;
    const updatedItems = [...da.items];
    updatedItems[index].status =
      updatedItems[index].status === newStatus ? 0 : newStatus;
    setDa({ ...da, items: updatedItems });
  };

  // Fonction générique pour mettre à jour n'importe quel champ d'un item
  const handleItemUpdate = (index, field, value) => {
    if (lockedItemIds.includes(da.items[index].id)) return;
    const updatedItems = [...da.items];
    updatedItems[index][field] = value;
    setDa({ ...da, items: updatedItems });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/da/${id}/update-items`, { items: da.items });
      alert("Enregistrement effectué !");
      navigate("/achat");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
    } finally {
      setLoading(false);
    }
  };

  if (!da) return <Chargement />;

  return (
    <div className="p-6 min-h-screen bg-[#1a1d21] text-gray-200">
      <h1 className="text-center font-bold text-2xl mb-8 text-white tracking-widest">
        TRAITEMENT ACHAT - DA N° {da.numero_da}
      </h1>

      <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-[#282c34a3] backdrop-blur-md">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-gray-400 uppercase text-[11px]">
            <tr>
              <th className="p-2">Libellé</th>
              <th className="p-2 text-center">Qte</th>
              <th className="p-2">Emplacement</th>
              <th className="p-2 text-center print:hidden">Action</th>
            </tr>
          </thead>
          <tbody>
            {da.items.map((item, index) => {
              const isAchete = item.status === 1;
              const isRefuse = item.status === 2;
              const isLocked = lockedItemIds.includes(item.id);

              return (
                <React.Fragment key={item.id || index}>
                  <tr
                    className={`border-t border-white/5 ${
                      isLocked ? "bg-black/20" : ""
                    } transition-colors`}
                  >
                    <td className="p-2 font-medium text-white">
                      {item.libelle}
                    </td>
                    <td className="p-2 text-center">
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold">
                        {item.quantite} {item.unite}
                      </span>
                    </td>
                    <td className="p-2 italic text-gray-400">
                      {item.emplacement}
                    </td>
                    <td className="p-2 print:hidden">
                      <div className="flex justify-center gap-6">
                        <button
                          onClick={() => handleChangeStatus(index, 1)}
                          disabled={isLocked}
                          className={`flex flex-col items-center gap-1 transition-all ${
                            isAchete
                              ? "text-green-400 scale-110"
                              : "text-gray-500 hover:text-green-500"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-full border ${
                              isAchete
                                ? "bg-green-500/20 border-green-500"
                                : "border-gray-600"
                            }`}
                          >
                            <FaCheck size={12} />
                          </div>
                          <span className="text-[9px] font-bold uppercase">
                            Acheter
                          </span>
                        </button>

                        <button
                          onClick={() => handleChangeStatus(index, 2)}
                          disabled={isLocked}
                          className={`flex flex-col items-center gap-1 transition-all ${
                            isRefuse
                              ? "text-red-400 scale-110"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-full border ${
                              isRefuse
                                ? "bg-red-500/20 border-red-500"
                                : "border-gray-600"
                            }`}
                          >
                            <FaTimes size={12} />
                          </div>
                          <span className="text-[9px] font-bold uppercase">
                            Refuser
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* FORMULAIRE ACHAT (Si coché Acheter) */}
                  {isAchete && (
                    <tr className="bg-green-500/5 border-l-4 border-l-green-500 animate-fadeIn">
                      <td colSpan="4" className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <InputSmall
                            label="Date Facture"
                            type="date"
                            value={item.date_facture}
                            onChange={(v) =>
                              handleItemUpdate(index, "date_facture", v)
                            }
                            disabled={isLocked}
                          />
                          <InputSmall
                            label="Date BC"
                            type="date"
                            value={item.date_bc}
                            onChange={(v) =>
                              handleItemUpdate(index, "date_bc", v)
                            }
                            disabled={isLocked}
                          />
                          <InputSmall
                            label="N° BC"
                            placeholder="Ex: BC-2024..."
                            value={item.num_bc}
                            onChange={(v) =>
                              handleItemUpdate(index, "num_bc", v)
                            }
                            disabled={isLocked}
                          />
                          <InputSmall
                            label="P.U (Ar)"
                            type="number"
                            value={item.pu}
                            onChange={(v) => handleItemUpdate(index, "pu", v)}
                            disabled={isLocked}
                          />
                          <InputSmall
                            label="Fournisseur"
                            placeholder="Nom du tiers"
                            value={item.fournisseur}
                            onChange={(v) =>
                              handleItemUpdate(index, "fournisseur", v)
                            }
                            disabled={isLocked}
                          />
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* MOTIF REFUS (Si coché Refuser) */}
                  {isRefuse && (
                    <tr className="bg-red-500/5 border-l-4 border-l-red-500">
                      <td colSpan="4" className="p-4">
                        <textarea
                          placeholder="Saisir le motif du refus..."
                          className="w-full bg-[#1a1d21] border border-red-500/30 rounded-lg p-2 text-xs text-white outline-none focus:border-red-500"
                          value={item.motif_refus || ""}
                          onChange={(e) =>
                            handleItemUpdate(
                              index,
                              "motif_refus",
                              e.target.value
                            )
                          }
                          disabled={isLocked}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BOUTONS ACTIONS */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Annuler et retourner
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Valider le traitement"}
        </button>
      </div>
    </div>
  );
};

// Composant interne pour les petits champs du formulaire
const InputSmall = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="bg-[#1a1d21] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none transition-all disabled:opacity-50"
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

export default AchatView;
