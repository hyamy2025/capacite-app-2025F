import React, { useState } from "react";
import TableauSalles from "./TableauSalles";
import TableauRepartition from "./TableauRepartition";
import TableauResultats from "./TableauResultats";

// بيانات التخصصات الافتراضية (يمكنك التعديل حسب الحاجة)
const specialties = [
  { "Spécialité": "Math", "Besoin Théorique par Groupe": 10, "Besoin Pratique par Groupe": 12 },
  { "Spécialité": "Physique", "Besoin Théorique par Groupe": 8, "Besoin Pratique par Groupe": 14 },
];

export default function ResultsContainer() {
  // إدارة حالة الجداول الثلاثة
  const [cno, setCno] = useState(1.0);
  const [semaines, setSemaines] = useState(72);
  const [heures, setHeures] = useState(56);
  const [salles, setSalles] = useState([
    { surface: '', cno: 1.0, semaines: 72, heures: 56, surfaceP: 0, heuresMax: 0 },
  ]);
  const [effectifData, setEffectifData] = useState([
    { specialite: "Math", groupes: 2, apprenants: 30 },
    { specialite: "Physique", groupes: 1, apprenants: 20 },
  ]);

  // الحسابات المجمعة للتمرير إلى TableauResultats
  const totalHeuresTheo = salles.reduce((sum, s) => sum + Number(s.heuresMax||0), 0);
  const totalHeuresPrat = totalHeuresTheo; // إذا نفس الساعات العملية والنظرية
  const besoinTheoTotal = effectifData.reduce((sum, row) => {
    const spec = specialties.find(s => s["Spécialité"] === row.specialite) || {};
    return sum + (Number(row.groupes) * Number(spec["Besoin Théorique par Groupe"] || 0));
  }, 0);
  const besoinPratTotal = effectifData.reduce((sum, row) => {
    const spec = specialties.find(s => s["Spécialité"] === row.specialite) || {};
    return sum + (Number(row.groupes) * Number(spec["Besoin Pratique par Groupe"] || 0));
  }, 0);

  const moyenneBesoinTheo = (() => {
    const arr = effectifData.map(row => {
      const spec = specialties.find(s => s["Spécialité"] === row.specialite) || {};
      return Number(spec["Besoin Théorique par Groupe"]) || 0;
    });
    if (arr.length === 0) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  })();

  const moyenneBesoinPrat = (() => {
    const arr = effectifData.map(row => {
      const spec = specialties.find(s => s["Spécialité"] === row.specialite) || {};
      return Number(spec["Besoin Pratique par Groupe"]) || 0;
    });
    if (arr.length === 0) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  })();

  const moyenneSurfaceTheo = salles.length
    ? (salles.reduce((a, s) => a + Number(s.surfaceP) || 0, 0) / salles.length).toFixed(2)
    : 0;
  const moyenneSurfacePrat = moyenneSurfaceTheo;

  return (
    <div>
      <div className="flex gap-6">
        <TableauSalles
          salles={salles}
          setSalles={setSalles}
          cno={cno}
          setCno={setCno}
          semaines={semaines}
          setSemaines={setSemaines}
          heures={heures}
          setHeures={setHeures}
        />
        <TableauRepartition
          effectifData={effectifData}
          specialties={specialties}
          setEffectifData={setEffectifData}
        />
      </div>
      <TableauResultats
        data={{
          totalHeuresTheo: Number(totalHeuresTheo),
          totalHeuresPrat: Number(totalHeuresPrat),
          besoinTheoTotal: Number(besoinTheoTotal),
          besoinPratTotal: Number(besoinPratTotal),
          moyenneBesoinTheo: Number(moyenneBesoinTheo),
          moyenneBesoinPrat: Number(moyenneBesoinPrat),
          moyenneSurfaceTheo: Number(moyenneSurfaceTheo),
          moyenneSurfacePrat: Number(moyenneSurfacePrat),
        }}
      />
    </div>
  );
}