import React, { useState } from "react";
import TableauSalles from "./TableauSalles";
import TableauRepartition from "./TableauRepartition";
import TableauResultats from "./TableauResultats";

const specialties = [
  { "Spécialité": "Math", "Besoin Théorique par Groupe": 10, "Besoin Pratique par Groupe": 12 },
  { "Spécialité": "Physique", "Besoin Théorique par Groupe": 8, "Besoin Pratique par Groupe": 14 },
];

const defaultSalles = {
  theorie: [{ surface: '', cno: 1.0, semaines: 72, heures: 56, surfaceP: 0, heuresMax: 0 }],
  pratique: [{ surface: '', cno: 1.0, semaines: 72, heures: 56, surfaceP: 0, heuresMax: 0 }],
  tpSpecifiques: [{ surface: '', cno: 1.0, semaines: 72, heures: 56, surfaceP: 0, heuresMax: 0 }],
};

const defaultCnos = { theorie: 1.0, pratique: 1.0, tpSpecifiques: 1.0 };
const defaultSemaines = { theorie: 72, pratique: 72, tpSpecifiques: 72 };
const defaultHeures = { theorie: 56, pratique: 56, tpSpecifiques: 56 };

export default function ResultsContainer() {
  const [salles, setSalles] = useState(defaultSalles);
  const [cnos, setCnos] = useState(defaultCnos);
  const [semaines, setSemaines] = useState(defaultSemaines);
  const [heures, setHeures] = useState(defaultHeures);
  const [effectifData, setEffectifData] = useState([
    { specialite: "Math", groupes: 2, apprenants: 30 },
    { specialite: "Physique", groupes: 1, apprenants: 20 },
  ]);

  // حماية ضد undefined لأي نوع قاعة
  const safeSalles = {
    theorie: salles?.theorie || [],
    pratique: salles?.pratique || [],
    tpSpecifiques: salles?.tpSpecifiques || [],
  };

  // متغيرات النتائج لكل نوع قاعة
  const totalHeuresTheo = safeSalles.theorie.reduce((sum, s) => sum + Number(s.heuresMax || 0), 0);
  const totalHeuresPrat = safeSalles.pratique.reduce((sum, s) => sum + Number(s.heuresMax || 0), 0);
  const totalHeuresTPS = safeSalles.tpSpecifiques.reduce((sum, s) => sum + Number(s.heuresMax || 0), 0);

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

  const moyenneSurfaceTheo = safeSalles.theorie.length
    ? (safeSalles.theorie.reduce((a, s) => a + Number(s.surfaceP) || 0, 0) / safeSalles.theorie.length).toFixed(2)
    : 0;
  const moyenneSurfacePrat = safeSalles.pratique.length
    ? (safeSalles.pratique.reduce((a, s) => a + Number(s.surfaceP) || 0, 0) / safeSalles.pratique.length).toFixed(2)
    : 0;
  const moyenneSurfaceTPS = safeSalles.tpSpecifiques.length
    ? (safeSalles.tpSpecifiques.reduce((a, s) => a + Number(s.surfaceP) || 0, 0) / safeSalles.tpSpecifiques.length).toFixed(2)
    : 0;

  return (
    <div>
      <TableauSalles
        salles={salles}
        setSalles={setSalles}
        cnos={cnos}
        setCnos={setCnos}
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
      <TableauResultats
        data={{
          totalHeuresTheo: Number(totalHeuresTheo),
          totalHeuresPrat: Number(totalHeuresPrat),
          totalHeuresTPS: Number(totalHeuresTPS),
          besoinTheoTotal: Number(besoinTheoTotal),
          besoinPratTotal: Number(besoinPratTotal),
          moyenneBesoinTheo: Number(moyenneBesoinTheo),
          moyenneBesoinPrat: Number(moyenneBesoinPrat),
          moyenneSurfaceTheo: Number(moyenneSurfaceTheo),
          moyenneSurfacePrat: Number(moyenneSurfacePrat),
          moyenneSurfaceTPS: Number(moyenneSurfaceTPS),
        }}
      />
    </div>
  );
}