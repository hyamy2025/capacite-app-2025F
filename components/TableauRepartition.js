import { useState, useEffect } from 'react';
import {
  calculerBesoinHoraireParSpecialite,
  moyenneColonne,
  sommeColonne,
} from '../utils/calculs';

export default function TableauRepartition({ titre, effectifData, onDataChange }) {
  const [repartitions, setRepartitions] = useState([]);

  useEffect(() => {
    const updated = effectifData.map((spec) => ({
      nom: spec.nom,
      besoinTheoParGroupe: '',
      besoinTheoTotal: 0,
      besoinPratParGroupe: '',
      besoinPratTotal: 0,
    }));
    setRepartitions(updated);
  }, [effectifData]);

  useEffect(() => {
    if (onDataChange) onDataChange(repartitions);
  }, [repartitions]);

  const handleChange = (index, type, value) => {
    const newReps = [...repartitions];
    const groupes = parseInt(effectifData[index]?.totalGroupes || 0);
    if (type === 'theo') {
      newReps[index].besoinTheoParGroupe = value;
      newReps[index].besoinTheoTotal = calculerBesoinHoraireParSpecialite(value, groupes);
    } else if (type === 'prat') {
      newReps[index].besoinPratParGroupe = value;
      newReps[index].besoinPratTotal = calculerBesoinHoraireParSpecialite(value, groupes);
    }
    setRepartitions(newReps);
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>

      <table className="w-full table-auto border text-sm mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Spécialité</th>
            <th className="border p-2">Besoin Théorique<br />par Groupe</th>
            <th className="border p-2">Besoin Théorique<br />Total</th>
            <th className="border p-2">Besoin Pratique<br />par Groupe</th>
            <th className="border p-2">Besoin Pratique<br />Total</th>
          </tr>
        </thead>
        <tbody>
          {repartitions.map((rep, idx) => (
            <tr key={idx}>
              <td className="border p-2">{rep.nom}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={rep.besoinTheoParGroupe}
                  onChange={(e) => handleChange(idx, 'theo', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2 text-center">{rep.besoinTheoTotal}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={rep.besoinPratParGroupe}
                  onChange={(e) => handleChange(idx, 'prat', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2 text-center">{rep.besoinPratTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <div>
          <p><strong>Moyenne Théorique / Groupe:</strong> {moyenneColonne(repartitions.map(r => parseFloat(r.besoinTheoParGroupe || 0)))}</p>
          <p><strong>Total Théorique:</strong> {sommeColonne(repartitions.map(r => r.besoinTheoTotal))}</p>
        </div>
        <div>
          <p><strong>Moyenne Pratique / Groupe:</strong> {moyenneColonne(repartitions.map(r => parseFloat(r.besoinPratParGroupe || 0)))}</p>
          <p><strong>Total Pratique:</strong> {sommeColonne(repartitions.map(r => r.besoinPratTotal))}</p>
        </div>
      </div>
    </div>
  );
}
