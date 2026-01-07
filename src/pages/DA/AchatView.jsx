import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Chargement from "../../components/Chargement";

const AchatView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [da, setDa] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/da/${id}`).then((res) => setDa(res.data));
  }, [id]);

  

  // Fonction pour changer l'état (0: Attente, 1: Acheté, 2: Refusé)
  const handleChangeStatus = (index, newStatus) => {
    const updatedItems = [...da.items];
    // Si on clique sur le statut déjà actif, on repasse en attente (0)
    updatedItems[index].status = updatedItems[index].status === newStatus ? 0 : newStatus;
    setDa({ ...da, items: updatedItems });
  };

  const handleMotifChange = (index, motif) => {
    const updatedItems = [...da.items];
    updatedItems[index].motif_refus = motif;
    setDa({ ...da, items: updatedItems });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log(da.items);
      await api.put(`/da/${id}/update-items`, { items: da.items });
      alert("Mise à jour réussie !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
    } finally {
      setLoading(false);
    }
  };

  if (!da) return <Chargement />;

  return (
    <div className="p-6 min-h-screen print:bg-white print:p-0">
      <h1 className="text-center font-bold text-2xl mb-6">
        SUIVI DE DEMANDE D’ACHAT N° {da.numero_da}
      </h1>

      {/* TABLEAU ARTICLES */}
      <table className="w-full text-sm text-gray-300 bg-[#343a40] rounded-md overflow-hidden">
        <thead>
          <tr className="text-white border-b border-gray-600">
            <th className="p-3 text-left">LIBELLÉ</th>
            <th className="p-3 w-16 text-center">QTE</th>
            <th className="p-3 w-20 text-center">UNITÉ</th>
            <th className="p-3 text-left">EMPLACEMENT</th>
            <th className="p-3 w-64 text-center print:hidden">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {da.items.map((item, index) => {
            const isAchete = item.status === 1;
            const isRefuse = item.status === 2;

            return (
              <React.Fragment key={index}>
                <tr className={`border-b border-gray-700 ${isRefuse ? 'opacity-60' : ''}`}>
                  <td className="p-3 font-medium">{item.libelle}</td>
                  <td className="p-3 text-center">{item.quantite}</td>
                  <td className="p-3 text-center">{item.unite}</td>
                  <td className="p-3 italic">{item.emplacement}</td>
                  
                  {/* Colonne Action - Masquée à l'impression */}
                  <td className="p-3 text-center print:hidden">
                    <div className="flex items-center justify-center gap-4">
                      {/* Checkbox Acheté */}
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-green-600"
                          checked={isAchete}
                          onChange={() => handleChangeStatus(index, 1)}
                        />
                        <span className={`text-[10px] font-bold uppercase ${isAchete ? 'text-green-400' : ''}`}>Acheter</span>
                      </div>

                      {/* Checkbox Refuser */}
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-red-600"
                          checked={isRefuse}
                          onChange={() => handleChangeStatus(index, 2)}
                        />
                        <span className={`text-[10px] font-bold uppercase ${isRefuse ? 'text-red-400' : ''}`}>Refuser</span>
                      </div>
                    </div>
                  </td>
                </tr>
                
                {/* Ligne pour le motif si refusé (Masqué à l'impression) */}
                {isRefuse && (
                  <tr className="bg-red-900 bg-opacity-20 print:hidden">
                    <td colSpan="5" className="p-2 px-4">
                      <input 
                        type="text"
                        placeholder="Saisir le motif du refus..."
                        className="w-full bg-gray-800 border border-red-500 rounded px-2 py-1 text-xs text-white outline-none"
                        value={item.motif_refus || ""}
                        onChange={(e) => handleMotifChange(index, e.target.value)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Note de clôture automatique */}
      <div className="mt-6 text-right italic text-sm text-gray-500">
        {da.items.every((i) => i.status === 1 || i.status === 2)
          ? "✅ Tous les articles ont été traités (Achetés ou Refusés)."
          : "⏳ En attente de traitement de certains articles."}
      </div>

      {/* ACTIONS (NON IMPRIMÉES) */}
      <div className="max-w-5xl mx-auto flex justify-between mt-8 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded shadow transition-all"
        >
          ← Retour
        </button>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-8 py-2 rounded shadow font-bold transition-all`}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>


        </div>
      </div>
    </div>
  );
};

export default AchatView;