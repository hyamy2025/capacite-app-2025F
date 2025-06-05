import { useState, useEffect } from 'react';
import { sommeColonne, moyenneColonne } from '../utils/calculs';

export default function TableauSalles({ titre, onDataChange }) {
  const [salles, setSalles] = useState([
    { nom: '', surfaceP: '', heuresParJour: '', semaines: 56 }
  ]);

  const [historique, setHistorique] = useState([]); // ✅ جديد

  useEffect(() => {
    const updated = salles.map((salle) => {
      const heuresParJour = parseFloat(salle.heuresParJour) || 0;
      const semaines = parseInt(salle.semaines) || 0;
      return {
        ...salle,
        heuresMax: heuresParJour * semaines,
      };
    });

    setSalles(updated);

    if (onDataChange) {
      const heuresTotales = sommeColonne(updated.map(s => s.heuresMax));
      const surfaceMoyenne = moyenneColonne(updated.map(s => parseFloat(s.surfaceP) || 0));
      onDataChange(updated, heuresTotales, surfaceMoyenne);
    }
  }, [salles]);

  const handleChange = (index, field, value) => {
    setHistorique([...historique, salles]); // ✅ حفظ الحالة قبل التعديل
    const updated = [...salles];
    updated[index][field] = value;
    setSalles(updated);
  };

  const ajouterSalle = () => {
    setHistorique([...historique, salles]); // ✅ حفظ الحالة قبل الإضافة
    setSalles([
      ...salles,
      { nom: '', surfaceP: '', heuresParJour: '', semaines: 56 }
    ]);
  };

  const annuler = () => {
    if (historique.length > 0) {
      const precedente = historique[historique.length - 1];
      setSalles(precedente);
      setHistorique(historique.slice(0, -1));
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>

      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Nom Salle</th>
            <th className="border p-2">Surface pédagogique (m²)</th>
            <th className="border p-2">Heures/Jour</th>
            <th className="border p-2">Semaines</th>
            <th className="border p-2">Heures max</th>
          </tr>
        </thead>
        <tbody>
          {salles.map((salle, idx) => (
            <tr key={idx}>
              <td className="border p-2">
                <input
                  type="text"
                  value={salle.nom}
                  onChange={(e) => handleChange(idx, 'nom', e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={salle.surfaceP}
                  onChange={(e) => handleChange(idx, 'surfaceP', e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={salle.heuresParJour}
                  onChange={(e) => handleChange(idx, 'heuresParJour', e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={salle.semaines}
                  onChange={(e) => handleChange(idx, 'semaines', e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2 text-center">
                {salle.heuresMax ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={ajouterSalle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Ajouter une salle
        </button>
        <button
          onClick={annuler}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
