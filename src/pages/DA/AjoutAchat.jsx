import React, { useEffect, useState } from "react";
import { FaCheck, FaPlus, FaTrash } from "react-icons/fa";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

/* ---------------- DATE TODAY ---------------- */
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const AjoutAchat = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    numeroDA: "",
    dateDa: getTodayDate(),
    site: "",
    status: 0,
    demandeur: "",
    items: [
      {
        libelle: "",
        quantite: 1,
        unite: "pcs", // ✅ Défini ici pour le premier item
        status: 0,
        emplacement: "",
        categorie: "Consommable", // ✅ "Consommable" par défaut
      },
    ],
  });

  /* ---------------- NUMERO DA ---------------- */
  useEffect(() => {
    const fetchNextDA = async () => {
      try {
        const res = await api.get("da/next-number");
        setForm((prev) => ({
          ...prev,
          numeroDA: res.data.numeroDA,
        }));
      } catch (error) {
        console.error("Erreur génération DA :", error);
      }
    };
    fetchNextDA();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          libelle: "",
          quantite: 1,
          unite: "pcs", // ✅ "pcs" par défaut lors de l'ajout d'une nouvelle ligne
          status: 0,
          emplacement: "",
          categorie: "Consommable", // ✅ "Consommable" par défaut
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("🚀 Envoi DA :", form);
    try {
      await api.post("/da", form);
      alert("DA ajoutée avec succès !");
      navigate("/achat");
    } catch (err) {
      console.error("❌ Erreur ajout DA :", err);
      if (err.response) {
        alert(err.response.data?.message || "Erreur serveur");
      } else {
        alert("Impossible de contacter le serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <div className="bg-[#343a40] p-4 rounded-lg text-white shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Ajouter une DA
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INFO DA */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="numeroDA"
              value={form.numeroDA}
              readOnly
              className="w-full p-2 text-sm rounded bg-[#2f343a] border border-gray-500 cursor-not-allowed text-gray-400"
            />

            <input
              type="date"
              value={form.dateDa}
              readOnly
              className="w-full p-2 text-sm rounded bg-[#2f343a] border border-gray-500 cursor-not-allowed text-gray-400"
            />

            <input
              name="demandeur"
              placeholder="Nom et prénoms"
              required
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
            />

            <select
              name="site"
              required
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
            >
              <option value="">-- Site --</option>
              <option value="HITA1">HITA1</option>
              <option value="HITA2">HITA2</option>
              <option value="HITA TANA">HITA TANA</option>
            </select>
          </div>

          {/* ARTICLES */}
          <div>
            <h3 className="text-md font-semibold mb-2">Articles demandés</h3>

            {form.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between gap-3 mb-3 items-center"
              >
                <input
                  placeholder="Libellé"
                  required
                  value={item.libelle}
                  onChange={(e) =>
                    handleItemChange(index, "libelle", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Quantité"
                  required
                  value={item.quantite}
                  onChange={(e) =>
                    handleItemChange(index, "quantite", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                />

                <select
                  value={item.unite}
                  onChange={(e) =>
                    handleItemChange(index, "unite", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 text-gray-200 outline-none"
                >
                  <option value="pcs">pcs</option>
                  <option value="pqt">pqt</option>
                  <option value="m">m</option>
                  <option value="kg">kg</option>
                  <option value="unité">unité</option>
                  <option value="RAM">RAM</option>
                  <option value="mois">Mois</option>
                </select>
                <select
                  value={item.categorie}
                  onChange={(e) =>
                    handleItemChange(index, "categorie", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 text-gray-200 outline-none"
                >
                  <option value="Consommable">Consommable</option>
                  <option value="Immobilisation">Immobilisation</option>
                </select>

                <input
                  placeholder="Emplacement / Destination"
                  required
                  value={item.emplacement}
                  onChange={(e) =>
                    handleItemChange(index, "emplacement", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                />
                 <input
                  placeholder="Section / Service / Projet"
                  required
                  value={item.projet}
                  onChange={(e) =>
                    handleItemChange(index, "projet", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={form.items.length === 1}
                  className="text-red-400 hover:text-red-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 mt-2 cursor-pointer font-medium"
            >
              <FaPlus /> Ajouter un article
            </button>
          </div>

          {/* ACTION */}
          <div className="text-right border-t border-gray-600 pt-4">
            <Button
              icon={<FaCheck size={12} />}
              type="submit"
              disabled={loading}
              label={
                loading ? "Enregistrement en cours..." : "Enregistrer la DA"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutAchat;
