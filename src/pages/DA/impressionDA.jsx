import { useNavigate, useParams } from "react-router-dom";
import logohita from "../../assets/hita.jpg";
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import Chargement from "../../components/Chargement";

const ImpressionDA = () => {
  const { id } = useParams(); // Récupère l'ID de l'URL
  const [da, setDa] = useState(null);
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (id) {
      api.get(`/da/${id}`).then((res) => setDa(res.data));
    }
  }, [id]);

  // Sécurité pendant le chargement des données
  if (!da) return <Chargement />;

  return (
    <div className="p-2 min-h-screen bg-gray-100 print:bg-white">
      {/* ZONE IMPRIMABLE */}
      <div className="bg-white text-black p-6 max-w-4xl mx-auto print:p-0 print:shadow-none shadow-md">
        {/* LOGO ET TITRE */}
        <div className="flex flex-col items-center mb-4">
          <img src={logohita} alt="Logo Hita" className="h-16 mb-2" />
          <h1 className="text-center font-bold text-xl uppercase border-b-2 border-black pb-1">
            Demande d’Achat
          </h1>
        </div>

        {/* ENTÊTE */}
        <div className="text-[12px] mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <strong className="mr-2">DIRECTION :</strong>
              {["DG", "DE", "DAFG", "DT", "DU1", "DU2", "DRH"].map((dir) => (
                <span
                  key={dir}
                  className={`border px-1.5 py-0.5 m-0.5 border-black ${
                    da.direction === dir ? "bg-black text-white font-bold" : ""
                  }`}
                >
                  {dir}
                </span>
              ))}
            </div>
            <p>
              <strong>DATE :</strong> {da.date_da}
            </p>
          </div>

          <div className="flex justify-between mt-3">
            <p>
              <strong>SERVICE :</strong> {da.service || "INFO / ADM"}
            </p>
            <p>
              <strong>SITE :</strong> {da.site}
            </p>
          </div>

          <div className="flex justify-between mt-2">
            <p>
              <strong>NOM ET PRÉNOMS :</strong> {da.demandeur}
            </p>
            <p className="font-bold">
              N° : {da.numero_da}/INFO-{da.site}/26
            </p>
          </div>
        </div>

        {/* TABLEAU ARTICLES */}
        <table className="w-full border-collapse border border-black text-[12px] mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left w-[45%]">
                LIBELLÉ
              </th>
              <th className="border border-black p-2 w-[10%] text-center">
                QTE
              </th>
              <th className="border border-black p-2 w-[10%] text-center">
                UNITÉ
              </th>
              <th className="border border-black p-2 text-left w-[35%]">
                EMPLACEMENT / DESTINATION
              </th>
            </tr>
          </thead>
          <tbody>
            {da.items.map((item, index) => (
              /* La ligne s'adapte automatiquement à la hauteur du texte */
              <tr key={index} className="break-inside-avoid">
                <td className="border border-black p-2 align-top whitespace-pre-wrap break-words">
                  {item.libelle}
                </td>
                <td className="border border-black p-2 text-center align-top">
                  {item.quantite}
                </td>
                <td className="border border-black p-2 text-center align-top">
                  {item.unite}
                </td>
                <td className="border border-black p-2 align-top break-words">
                  {item.emplacement}
                </td>
              </tr>
            ))}
            {/* PLUS DE LIGNES VIDES ICI */}
          </tbody>
        </table>

        {/* SIGNATURES */}
        <div className="grid grid-cols-5 gap-1 italic text-[10px] text-center mt-10 mb-4 font-bold">
          <div className="flex flex-col h-20 justify-between">
            <span className="underline">Demandeur</span>
            <div className="h-full border border-dashed border-gray-300 m-1"></div>
          </div>
          <div className="flex flex-col h-20 justify-between">
            <span className="underline">Dept / Direction</span>
            <div className="h-full border border-dashed border-gray-300 m-1"></div>
          </div>
          <div className="flex flex-col h-20 justify-between">
            <span className="underline">Dispo Magasin</span>
            <div className="h-full border border-dashed border-gray-300 m-1"></div>
          </div>
          <div className="flex flex-col h-20 justify-between">
            <span className="underline">Direction Admin</span>
            <div className="h-full border border-dashed border-gray-300 m-1"></div>
          </div>
          <div className="flex flex-col h-20 justify-between">
            <span className="underline">Resp. Appro</span>
            <div className="h-full border border-dashed border-gray-300 m-1"></div>
          </div>
        </div>

        <div className="mt-12 flex justify-end gap-10 italic text-[11px]">
          <div>Date :........................</div>
          <div>Heure :........................</div>
        </div>
      </div>

      {/* ACTIONS (NON IMPRIMÉES) */}
      <div className="max-w-4xl mx-auto flex justify-between mt-6 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded transition-all"
        >
          ← Retour
        </button>

        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded font-bold shadow-lg transition-all"
        >
          🖨️ Lancer l'impression
        </button>
      </div>
    </div>
  );
};

export default ImpressionDA;
