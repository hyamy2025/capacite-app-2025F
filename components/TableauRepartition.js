import React from "react";

export default function TableauRepartition({ titre, effectifData = [], specialties = [], onDataChange }) {
  // دالة لإيجاد بيانات التخصص في ملف الإكسل
  const findSpecialtyData = (specialite) => {
    return specialties.find(s => s["Spécialité"] === specialite) || {};
  };

  // دائمًا يظهر صف واحد على الأقل مع الاسم إذا كان مختار
  const rows = effectifData && effectifData.length > 0
    ? effectifData.filter(row => !!row.specialite)
    : [{ specialite: "", groupes: 0, apprenants: 0 }];

  // يمكنك هنا إضافة منطق onDataChange إذا كنت تحتاج لحسابات إضافية أو مزامنة
  // مثلاً:
  // useEffect(() => { onDataChange && onDataChange(...); }, [effectifData]);

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
          {rows.map((row, idx) => {
            const spec = findSpecialtyData(row.specialite);
            return (
              <tr key={idx}>
                <td className="border p-2">{row.specialite || ""}</td>
                <td className="border p-2 text-center">{spec["Besoin Théorique par Groupe"] || ""}</td>
                <td className="border p-2 text-center">{spec["Besoin Pratique par Groupe"] || ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}