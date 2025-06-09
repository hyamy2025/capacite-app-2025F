import React, { useState } from "react";
import {
  calculerSurfacePedagogique,
  calculerHeuresMax,
  moyenneColonne,
  sommeColonne
} from "../utils/calculs";

export default function TableauSalles({ titre }) {
  const [cno, setCno] = useState(1);
  const [semaines, setSemaines] = useState(16);
  const [salles, setSalles] = useState([
    { surface: '', cno: 1.0, semaines: 16, surfaceP: 0, heuresMax: 0 },
  ]);
  const [historique, setHistorique] = useState([]);

  // خيارات CNO و Semaines
  const cnoOptions = Array.from({ length: 21 }, (_, i) => (1 + i * 0.1).toFixed(1));
  const semainesOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleChange = (index, field, value) => {
    const newSalles = [...salles];
    newSalles[index][field] = value;
    if (field === 'surface') {
      newSalles[index].surfaceP = calculerSurfacePedagogique(
        parseFloat(newSalles[index].surface || 0),
        parseFloat(cno)
      );
    }
    if (field === 'surface' || field === 'semaines' || field === 'cno') {
      newSalles[index].heuresMax = calculerHeuresMax(semaines);
    }
    setHistorique([...historique, salles]);
    setSalles(newSalles);
  };

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

  // حساب المجاميع والمعدلات
  const totalHeuresMax = sommeColonne(salles.map(s => Number(s.heuresMax) || 0));
  const moyenneSurfaceP = moyenneColonne(salles.map(s => Number(s.surfaceP) || 0));

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8 flex-1">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: "2rem" }}>
        <label>
          CNO:
          <select
            value={cno}
            onChange={(e) => updateCno(Number(e.target.value))}
            style={{ marginLeft: 8, width: 80 }}
          >
            {cnoOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label>
          Semaines:
          <select
            value={semaines}
            onChange={(e) => updateSemaines(Number(e.target.value))}
            style={{ marginLeft: 8, width: 80 }}
          >
            {semainesOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
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
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td className="border p-2 text-center" colSpan={2}>
              Moyenne / Somme
            </td>
            <td className="border p-2 text-center">{moyenneSurfaceP}</td>
            <td className="border p-2 text-center">{totalHeuresMax}</td>
          </tr>
        </tfoot>
      </table>
      <div className="flex gap-4 mt-4 justify-center">
        <button
          className="bg-blue-500 text-white rounded px-3 py-1"
          onClick={ajouterSalle}
        >
          Ajouter salle
        </button>
        <button
          className="bg-gray-300 text-gray-700 rounded px-3 py-1"
          onClick={annulerModification}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}