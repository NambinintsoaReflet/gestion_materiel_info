import React from "react";
import { 
  FaInfoCircle, 
  FaUserPlus, 
  FaUserShield, 
  FaClipboardCheck, 
  FaLayerGroup, 
  FaHistory 
} from "react-icons/fa";

const Aide = () => {
  return (
    <div className="min-h-screen bg-[#1a1d21] text-gray-300 p-4">
      {/* En-tête de la page */}
      <div className="max-w-4xl mx-auto mb-6 border-b border-gray-700 pb-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaInfoCircle className="text-blue-500" /> Guide des Procédures d'Achat
        </h1>
        <p className="mt-2 text-gray-400">
          Ce guide explique le fonctionnement du flux de gestion, de la demande jusqu'à l'entrée en inventaire.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-4">
        
        {/* Règle 1 & 2 */}
        <section className="bg-[#2d3238] p-6 rounded-xl border border-[#4a4f55]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaUserPlus className="text-green-400" /> 1. Émission et Validation
          </h2>
          <div className="space-y-3">
            <p>
              Tout utilisateur peut soumettre une <strong>Demande d'Achat (DA)</strong>. 
              Une fois créée, la demande est transmise au service des achats.
            </p>
            <div className="bg-black/20 p-3 rounded border-l-4 border-blue-500 italic text-sm">
              L'acheteur doit obligatoirement traiter chaque ligne en choisissant entre : 
              <span className="text-green-400 font-bold"> "Acheté"</span> ou 
              <span className="text-red-400 font-bold"> "Refusé"</span>.
            </div>
          </div>
        </section>

        {/* Règle 3 */}
        <section className="bg-[#2d3238] p-6 rounded-xl border border-[#4a4f55]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaClipboardCheck className="text-blue-400" /> 2. Entrée en Inventaire
          </h2>
          <p>
            Pour garantir la précision du stock, un article issu d'une DA ne peut pas être ajouté 
            automatiquement à la liste du matériel tant que son achat n'est pas confirmé par l'acheteur.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            * Note : Les ajouts de matériels exceptionnels (hors flux DA) restent possibles via le menu d'inventaire direct.
          </p>
        </section>

        {/* Règle 4 */}
        <section className="bg-[#2d3238] p-6 rounded-xl border border-[#4a4f55]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaLayerGroup className="text-purple-400" /> 3. Classification Obligatoire
          </h2>
          <p className="mb-4">Lors de la saisie, vous devez impérativement catégoriser l'article :</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1a1d21] p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-orange-400 mb-1">Consommable</h4>
              <p className="text-xs">Articles à usage unique ou à rotation rapide (Encre, Pile, etc.).</p>
            </div>
            <div className="bg-[#1a1d21] p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-purple-400 mb-1">Immobilisation</h4>
              <p className="text-xs">Matériel durable destiné au patrimoine (PC, Onduleur, outils).</p>
            </div>
          </div>
        </section>

        {/* Règle 5 */}
        <section className="bg-[#2d3238] p-6 rounded-xl border border-[#4a4f55]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaHistory className="text-yellow-400" /> 4. Suivi des demandes
          </h2>
          <p>
            Les demandes non traitées sont visibles en priorité dans le tableau de bord de l'acheteur. 
            Tant qu'un article n'est pas "Acheté" ou "Refusé", il est considéré comme <strong>En attente</strong>.
          </p>
        </section>

      </div>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        Version 1.0 - Gestion Materiels Informatique
      </footer>
    </div>
  );
};

export default Aide;