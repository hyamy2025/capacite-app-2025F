import { useState } from 'react';
import {
  calculerSurfacePedagogique,
  calculerHeuresMax,
  moyenneColonne,
  sommeColonne,
} from '../utils/calculs';

export default function TableauSalles({ titre }) {
  const [salles, setSalles] = useState([
    { surface: '', cno: 1.0, semaines: '', surfaceP: 0, heuresMax: 0 },
  ]);
  const [historique, setHistorique] = useState([]);

  const handleChange = (index, field, value) => {
    const newSalles = [...salles];
    newSalles[index][field] = field === 'cno' ? parseFloat(value) : value;
    if (field === 'surface' || field === 'cno') {
      newSalles[index].surfaceP = calculerSurfacePedagogique(
        parseFloat(newSalles[index].surface || 0),
        parseFloat(newSalles[index].cno || 1)
      );
    }
    if (field === 'semaines') {
      newSalles[index].heuresMax = calculerHeuresMax(parseInt(value || 0));
    }
    setHistorique([...historique, salles]);
    setSalles(newSalles);
  };

  const ajouterSalle = () => {
    setHistorique([...historique, salles]);
    setSalles([
      ...salles,
      { surface: '', cno: 1.0, semaines: '', surfaceP: 0, heuresMax: 0 },
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
      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Surface (m²)</th>
            <th className="border p-2">CNO</th>
            <th className="border p-2">Surface Pédagogique</th>
            <th className="border p-2">Semaines</th>
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
              <td className="border p-2">
                <select
                  value={salle.cno}
                  onChange={(e) => handleChange(index, 'cno', e.target.value)}
                  className="w-full p-1 border rounded"
                >
                  {Array.from({ length: 21 }, (_, i) => (1 + i * 0.1).toFixed(1)).map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2 text-center">{salle.surfaceP}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={salle.semaines}
                  onChange={(e) => handleChange(index, 'semaines', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2 text-center">{salle.heuresMax}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-700">
          <p><strong>Moyenne Surface Pédagogique:</strong> {moyenneColonne(salles.map(s => s.surfaceP))}</p>
          <p><strong>Total Heures Max:</strong> {sommeColonne(salles.map(s => s.heuresMax))}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={ajouterSalle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Ajouter une salle
          </button>
          <button
            onClick={annulerModification}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}