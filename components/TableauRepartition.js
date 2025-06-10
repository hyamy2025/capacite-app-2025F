import React from "react";

// دوال حسابية افتراضية - عدلها حسب الحاجة
const calcBesoinTheo = apprenants => Math.ceil((apprenants || 0) / 20);
const calcBesoinPrat = apprenants => Math.ceil((apprenants || 0) / 12);

export default function TableauRepartition({ titre, effectifData }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>

      <table className="w-full table-auto border text-sm mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Spécialité</th>
            <th className="border p-2">Besoin Théorique<br />par Groupe</th>
            <th className="border p-2">Besoin Pratique<br />par Groupe</th>
          </tr>
        </thead>
        <tbody>
          {effectifData
            .filter(row => row.specialite && row.apprenants)
            .map((row, idx) => (
              <tr key={idx}>
                <td className="border p-2">{row.specialite}</td>
                <td className="border p-2 text-center">{calcBesoinTheo(row.apprenants)}</td>
                <td className="border p-2 text-center">{calcBesoinPrat(row.apprenants)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}