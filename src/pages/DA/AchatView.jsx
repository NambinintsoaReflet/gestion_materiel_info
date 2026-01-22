import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Chargement from "../../components/Chargement";
import { FaCheck, FaTimes } from "react-icons/fa";
import InputSmall from "../../components/InputSmall";
import Button from "../../components/Button";

const AchatView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [da, setDa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lockedItemIds, setLockedItemIds] = useState([]);

  const formatNumber = (value) => {
    // 1. Gérer les cas vides ou non numériques
    if (value === null || value === undefined || value === "") return "";

    // 2. Convertir en chaîne et nettoyer tout caractère non numérique existant
    // (Utile si la valeur provient d'un input déjà formaté)
    const stringValue = value.toString().replace(/\s/g, "");

    // 3. Transformer en nombre
    const number = parseFloat(stringValue);
    if (isNaN(number)) return "";

    // 4. Utiliser l'API internationale pour le séparateur de milliers (espace insécable)
    return new Intl.NumberFormat("fr-FR").format(number);
  };

  // GET ALL DA DETAILS
  useEffect(() => {
    api.get(`/da/${id}`).then((res) => {
      setDa(res.data);
      console.log(res.data);
      const locked = res.data.items
        .filter((item) => Number(item.status) !== 0)
        // .filter((item) => item.status !== 0)
        .map((item) => item.id);
      setLockedItemIds(locked);
    });
  }, [id]);

  // GESTION CHANGEMENT STATUS ITEM
  const handleChangeStatus = (index, newStatus) => {
    if (lockedItemIds.includes(da.items[index].id)) return;
    const updatedItems = [...da.items];
    updatedItems[index].status =
      updatedItems[index].status === newStatus ? 0 : newStatus;
    console.log(updatedItems[index]);
    setDa({ ...da, items: updatedItems });
  };

  // Fonction générique pour mettre à jour n'importe quel champ d'un item
  const handleItemUpdate = (index, field, value) => {
    if (lockedItemIds.includes(da.items[index].id)) return;
    const updatedItems = [...da.items];
    updatedItems[index][field] = value;
    setDa({ ...da, items: updatedItems });
  };

  // SAUVEGARDE DES MODIFICATIONS
  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/da/${id}/update-items`, { items: da.items });
      console.log(da.items);
      alert("Enregistrement effectué !");
      // navigate("/achat");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
    } finally {
      setLoading(false);
    }
  };

  if (!da) return <Chargement />;

  return (
    <div className="p-4 min-h-screen bg-[#1a1d21] text-gray-200">
      <h2 className="text-center font-bold mb-4 text-white tracking-widest">
        TRAITEMENT ACHAT - DA N° {da.numero_da}
      </h2>

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
              const isAchete = Number(item.status) === 1;
              const isRefuse = Number(item.status) === 2;
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
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
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
                            className={`p-1 rounded-full border ${
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
                            className={`p-1 rounded-full border ${
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

                  {isAchete && !isLocked && (
                    <tr className="bg-green-500/5 border-l-4 border-l-green-500 animate-fadeIn">
                      <td colSpan="5" className="p-2">
                        {/* Passage à grid-cols-7 pour accommoder les nouveaux champs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
                            type="text" // Changé de "number" à "text" pour autoriser les espaces
                            value={formatNumber(item.prix_unitaire)}
                            onChange={(v) => {
                              // Ajout de l'accolade ouvrante
                              // On nettoie la valeur : on enlève les espaces et les caractères non-numériques
                              const rawValue = v
                                .replace(/\s/g, "")
                                .replace(/[^0-9.]/g, "");

                              if (!isNaN(rawValue) || rawValue === "") {
                                handleItemUpdate(
                                  index,
                                  "prix_unitaire",
                                  rawValue,
                                );
                              }
                            }} // Ajout de l'accolade fermante
                            disabled={isLocked}
                          />
                          {/* NOUVEAU : Remise */}
                          <InputSmall
                            label="Remise"
                            type="text" // Toujours text pour voir les espaces
                            value={formatNumber(item.remise)}
                            onChange={(v) => {
                              // On retire les espaces pour stocker un vrai nombre dans le state
                              const rawValue = v.replace(/\s/g, "");
                              if (!isNaN(rawValue) || rawValue === "") {
                                handleItemUpdate(index, "remise", rawValue);
                              }
                            }}
                          />
                          {/* NOUVEAU : Frais de livraison */}
                          <InputSmall
                            label="Livraison (Ar)"
                            type="text" // Changé en text pour permettre l'affichage des espaces
                            placeholder="0"
                            value={formatNumber(item.frais_livraison)}
                            onChange={(v) => {
                              // 1. On retire les espaces pour le stockage
                              // 2. On retire tout ce qui n'est pas un chiffre
                              const rawValue = v
                                .replace(/\s/g, "")
                                .replace(/[^0-9]/g, "");

                              // On met à jour l'état avec la valeur brute
                              handleItemUpdate(
                                index,
                                "frais_livraison",
                                rawValue,
                              );
                            }}
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
                      <td colSpan="4" className="p-2">
                        <input
                          type="text"
                          placeholder="Saisir le motif du refus..."
                          className="w-full bg-[#1a1d21] border border-red-500/30 rounded-lg p-2 text-xs text-white outline-none focus:border-red-500"
                          value={item.motif_refus || ""}
                          onChange={(e) =>
                            handleItemUpdate(
                              index,
                              "motif_refus",
                              e.target.value,
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
        <Button
          onClick={handleSave}
          icon={<FaCheck size={12} />}
          disabled={loading}
          label={loading ? "Chargement..." : "Valider le traitement"}
        />
      </div>
    </div>
  );
};

// Composant interne pour les petits champs du formulaire
// const InputSmall = ({ label, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
//       {label}
//     </label>
//     <input
//       {...props}
//       className="bg-[#1a1d21] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none transition-all disabled:opacity-50"
//       onChange={(e) => props.onChange(e.target.value)}
//     />
//   </div>
// );

export default AchatView;
