import { useState, useEffect } from 'react';
import { 
  calculerBesoinHoraireParSpecialite,
  moyenneColonne,
  sommeColonne,
} from '../utils/calculs';

export default function TableauRepartition({ titre, effectifData }) {
  const initialState = effectifData.map((spec) => ({
    nom: spec.nom,
    besoinTheoParGroupe: '',
    besoinTheoTotal: 0,
    besoinPratParGroupe: '',
    besoinPratTotal: 0,
  }));

  const [repartitions, setRepartitions] = useState(initialState);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    const updated = effectifData.map((spec, idx) => ({
      ...repartitions[idx],
      nom: spec.nom,
    }));
    setRepartitions(updated);
  }, [effectifData]);

  const handleChange = (index, type, value) => {
    const newReps = [...repartitions];
    if (type === 'theoGroupe') {
      newReps[index].besoinTheoParGroupe = value;
      const groupes = parseInt(effectifData[index].totalGroupes || 0);
      newReps[index].besoinTheoTotal = calculerBesoinHoraireParSpecialite(
        parseFloat(value || 0),
        groupes
      );
    }
    if (type === 'pratGroupe') {
      newReps[index].besoinPratParGroupe = value;
      const groupes = parseInt(effectifData[index].totalGroupes || 0);
      newReps[index].besoinPratTotal = calculerBesoinHoraireParSpecialite(
        parseFloat(value || 0),
        groupes
      );
    }
    setHistorique([...historique, repartitions]);
    setRepartitions(newReps);
  };

  const annuler = () => {
    if (historique.length > 0) {
      const dernier = historique[historique.length - 1];
      setRepartitions(dernier);
      setHistorique(historique.slice(0, -1));
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>
      <table className="w-full table-auto border text-sm mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Spécialité</th>
            <th className="border p-2">Besoin Théorique (Groupe / Spécialité)</th>
            <th className="border p-2">Besoin Pratique (Groupe / Spécialité)</th>
          </tr>
        </thead>
        <tbody>
          {repartitions.map((rep, idx) => (
            <tr key={idx}>
              <td className="border p-2">{rep.nom}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={rep.besoinTheoParGroupe}
                  onChange={(e) => handleChange(idx, 'theoGroupe', e.target.value)}
                  className="w-1/2 border p-1 rounded m-1"
                  placeholder="Groupe"
                />
                <span className="block mt-1">
                  {rep.besoinTheoTotal}
                </span>
              </td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={rep.besoinPratParGroupe}
                  onChange={(e) => handleChange(idx, 'pratGroupe', e.target.value)}
                  className="w-1/2 border p-1 rounded m-1"
                  placeholder="Groupe"
                />
                <span className="block mt-1">
                  {rep.besoinPratTotal}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <div>
          <p>
            <strong>Moyenne Besoin Théorique (Par Groupe):</strong>{' '}
            {moyenneColonne(
              repartitions.map((r) => parseFloat(r.besoinTheoParGroupe || 0))
            )}
          </p>
          <p>
            <strong>Total Théorique (Par Spécialité):</strong>{' '}
            {sommeColonne(
              repartitions.map((r) => r.besoinTheoTotal)
            )}
          </p>
        </div>
        <div>
          <p>
            <strong>Moyenne Besoin Pratique (Par Groupe):</strong>{' '}
            {moyenneColonne(
              repartitions.map((r) => parseFloat(r.besoinPratParGroupe || 0))
            )}
          </p>
          <p>
            <strong>Total Pratique (Par Spécialité):</strong>{' '}
            {sommeColonne(
              repartitions.map((r) => r.besoinPratTotal)
            )}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
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