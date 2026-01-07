import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";

/* ---------------- DATE TODAY ---------------- */
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const AjoutAchat = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    numeroDA: "",
    dateReception: getTodayDate(), // ✅ OK maintenant
    site: "",
    status: 0,
    demandeur: "",
    items: [
      {
        libelle: "",
        quantite: 1,
        unite: "",
        emplacement: "",
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
        { libelle: "", quantite: 1, unite: "", emplacement: "" },
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

    try {
      console.log("📌 Données DA envoyées :", form);

      const res = await api.post("/da", form);

      console.log("✅ Réponse API :", res.data);

      alert("DA ajoutée avec succès !");
      navigate("/achat");
    } catch (err) {
      console.error("❌ Erreur ajout DA :", err);

      // Message plus clair selon le type d’erreur
      if (err.response) {
        alert(
          err.response.data?.message ||
            "Erreur serveur lors de l’ajout de la DA"
        );
      } else {
        alert("Impossible de contacter le serveur");
      }
    } finally {
      // setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-4">
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
              className="w-full p-2 text-sm rounded bg-[#2f343a] border border-gray-500 cursor-not-allowed"
            />

            <input
              type="date"
              value={form.dateReception}
              readOnly
              className="w-full p-2 text-sm rounded bg-[#2f343a] border border-gray-500 cursor-not-allowed"
            />

            <input
              name="demandeur"
              placeholder="Nom et prénoms"
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
            />

            <select
              name="site"
              onChange={handleChange}
              className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
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
                className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-center"
              >
                <input
                  placeholder="Libellé"
                  value={item.libelle}
                  onChange={(e) =>
                    handleItemChange(index, "libelle", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
                />

                <input
                  type="number"
                  min="1"
                  value={item.quantite}
                  onChange={(e) =>
                    handleItemChange(index, "quantite", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
                />

                <input
                  placeholder="Unité"
                  value={item.unite}
                  onChange={(e) =>
                    handleItemChange(index, "unite", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
                />

                <input
                  placeholder="Emplacement / Destination"
                  value={item.emplacement}
                  onChange={(e) =>
                    handleItemChange(index, "emplacement", e.target.value)
                  }
                  className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={form.items.length === 1}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 mt-2 cursor-pointer"
            >
              <FaPlus /> Ajouter un article
            </button>
          </div>

          {/* ACTION */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-md"
            >
              Enregistrer la DA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutAchat;
