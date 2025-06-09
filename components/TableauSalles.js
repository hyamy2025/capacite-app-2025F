import React, { useState } from "react";
import { calculerSurfacePedagogique, calculerHeuresMax } from "../utils/calculs";

export default function TableauSalles({ titre }) {
  const [cno, setCno] = useState(1.0);
  const [semaines, setSemaines] = useState(30);
  const [salles, setSalles] = useState([
    { surface: '', cno: 1.0, semaines: 30, surfaceP: 0, heuresMax: 0 },
  ]);
  const [historique, setHistorique] = useState([]);

  const handleChange = (index, field, value) => {
    const newSalles = [...salles];
    newSalles[index][field] = value;
    if (field === 'surface') {
      newSalles[index].surfaceP = calculerSurfacePedagogique(
        parseFloat(newSalles[index].surface || 0),
        parseFloat(cno)
      );
    }
    setHistorique([...historique, salles]);
    setSalles(newSalles);
  };

  // عند تغيير القيم الموحدة، يتم تحديثها لكل القاعات
  const updateCno = (value) => {
    setCno(value);
    setSalles((prev) =>
      prev.map((salle) => ({
        ...salle,
        cno: value,
        surfaceP: calculerSurfacePedagogique(parseFloat(salle.surface || 0), parseFloat(value)),
      }))
    );
  };

  const updateSemaines = (value) => {
    setSemaines(value);
    setSalles((prev) =>
      prev.map((salle) => ({
        ...salle,
        semaines: value,
        heuresMax: calculerHeuresMax(value),
      }))
    );
  };

  const ajouterSalle = () => {
    setHistorique([...historique, salles]);
    setSalles([
      ...salles,
      {
        surface: '',
        cno: cno,
        semaines: semaines,
        surfaceP: 0,
        heuresMax: calculerHeuresMax(semaines),
      },
    ]);
  };

  const annulerModification = () => {
    if (historique.length > 0) {
      const dernierEtat = historique[historique.length - 1];
      setSalles(dernierEtat);
      setHistorique(historique.slice(0, -1));
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: "2rem" }}>
        <label>
          CNO:
          <input
            type="number"
            step="0.1"
            min={1}
            max={3}
            value={cno}
            onChange={(e) => updateCno(Number(e.target.value))}
            style={{ marginLeft: 8, width: 60 }}
          />
        </label>
        <label>
          Semaines:
          <input
            type="number"
            min={1}
            max={52}
            value={semaines}
            onChange={(e) => updateSemaines(Number(e.target.value))}
            style={{ marginLeft: 8, width: 60 }}
          />
        </label>
        <button
          className="bg-blue-500 text-white rounded px-3 py-1 ml-4"
          onClick={ajouterSalle}
        >
          Ajouter Salle
        </button>
        <button
          className="bg-gray-300 text-gray-700 rounded px-3 py-1 ml-2"
          onClick={annulerModification}
        >
          Annuler
        </button>
      </div>
      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Surface (m²)</th>
            <th className="border p-2">Surface Pédagogique</th>
            <th className="border p-2">Heures Max</th>
          </tr>
        </thead>
        <tbody>
          {salles.map((salle, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={salle.surface}
                  onChange={(e) => handleChange(index, 'surface', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2 text-center">{salle.surfaceP}</td>
              <td className="border p-2 text-center">{salle.heuresMax}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}