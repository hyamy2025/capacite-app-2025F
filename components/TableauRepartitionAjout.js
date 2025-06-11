import React, { useEffect } from "react";
import { calculerBesoinHoraireParSpecialiteAjout } from "../utils/calculsAjout";

export default function TableauRepartitionAjout({ effectifData, specialties, onDataChange }) {
  const findSpecialtyData = (specialite) => {
    return specialties.find(s => s["Spécialité"] === specialite) || {};
  };

  const rows = effectifData.length > 0
    ? effectifData.map(row => ({
        ...row,
        groupes: Number(row.groupes) || 0,
        groupesAjout: Number(row.groupesAjout) || 0,
        apprenants: Number(row.apprenants) || 0
      }))
    : [{ specialite: "", groupes: 0, groupesAjout: 0, apprenants: 0 }];

  const besoinTheoParGroupeArr = rows.map(row => {
    const spec = findSpecialtyData(row.specialite);
    return Number(spec["Besoin Théorique par Groupe"]) || 0;
  });
  const besoinPratParGroupeArr = rows.map(row => {
    const spec = findSpecialtyData(row.specialite);
    return Number(spec["Besoin Pratique par Groupe"]) || 0;
  });
  const besoinTheoParSpecArr = rows.map(row => {
    const spec = findSpecialtyData(row.specialite);
    return calculerBesoinHoraireParSpecialiteAjout(
      row.groupes || 0,
      row.groupesAjout || 0,
      spec["Besoin Théorique par Groupe"] || 0
    );
  });
  const besoinPratParSpecArr = rows.map(row => {
    const spec = findSpecialtyData(row.specialite);
    return calculerBesoinHoraireParSpecialiteAjout(
      row.groupes || 0,
      row.groupesAjout || 0,
      spec["Besoin Pratique par Groupe"] || 0
    );
  });

  const avgBesoinTheoParGroupe = besoinTheoParGroupeArr.length
    ? (besoinTheoParGroupeArr.reduce((a, b) => a + b, 0) / besoinTheoParGroupeArr.length).toFixed(2)
    : "0";
  const avgBesoinPratParGroupe = besoinPratParGroupeArr.length
    ? (besoinPratParGroupeArr.reduce((a, b) => a + b, 0) / besoinPratParGroupeArr.length).toFixed(2)
    : "0";
  const sumBesoinTheoParSpec = besoinTheoParSpecArr.reduce((a, b) => a + b, 0);
  const sumBesoinPratParSpec = besoinPratParSpecArr.reduce((a, b) => a + b, 0);

  // تحديث النتائج للأب عند أي تغيير
  useEffect(() => {
    if (onDataChange) {
      onDataChange([
        {
          besoinTheoTotal: sumBesoinTheoParSpec,
          besoinPratTotal: sumBesoinPratParSpec,
          besoinTheoParGroupe: Number(avgBesoinTheoParGroupe),
          besoinPratParGroupe: Number(avgBesoinPratParGroupe),
        }
      ]);
    }
  }, [sumBesoinTheoParSpec, sumBesoinPratParSpec, avgBesoinTheoParGroupe, avgBesoinPratParGroupe, onDataChange]);

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Répartition Prévue</h2>
      <table className="w-full table-auto border text-sm mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Spécialité</th>
            <th className="border p-2">Besoin Théorique<br />par Groupe</th>
            <th className="border p-2">Besoin Pratique<br />par Groupe</th>
            <th className="border p-2">Besoin Théorique<br />par Spécialité<br />(Existant+Ajout)</th>
            <th className="border p-2">Besoin Pratique<br />par Spécialité<br />(Existant+Ajout)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const spec = findSpecialtyData(row.specialite);
            const besoinTheoParSpecialite = calculerBesoinHoraireParSpecialiteAjout(
              row.groupes || 0,
              row.groupesAjout || 0,
              spec["Besoin Théorique par Groupe"] || 0
            );
            const besoinPratParSpecialite = calculerBesoinHoraireParSpecialiteAjout(
              row.groupes || 0,
              row.groupesAjout || 0,
              spec["Besoin Pratique par Groupe"] || 0
            );

            return (
              <tr key={idx}>
                <td className="border p-2">{row.specialite || ""}</td>
                <td className="border p-2 text-center">{spec["Besoin Théorique par Groupe"] || ""}</td>
                <td className="border p-2 text-center">{spec["Besoin Pratique par Groupe"] || ""}</td>
                <td className="border p-2 text-center">{besoinTheoParSpecialite}</td>
                <td className="border p-2 text-center">{besoinPratParSpecialite}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td className="border p-2 font-bold text-right"> Moyenne / Somme</td>
            <td className="border p-2 text-center font-bold">{avgBesoinTheoParGroupe}</td>
            <td className="border p-2 text-center font-bold">{avgBesoinPratParGroupe}</td>
            <td className="border p-2 text-center font-bold">{sumBesoinTheoParSpec}</td>
            <td className="border p-2 text-center font-bold">{sumBesoinPratParSpec}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}