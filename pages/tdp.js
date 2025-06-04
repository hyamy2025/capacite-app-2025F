import { useRef, useState } from "react";
import TableauSalles from "../components/TableauSalles";
import TableauEffectif from "../components/TableauEffectif";
import TableauRepartition from "../components/TableauRepartition";

export default function Tdp() {
  const pdfRef = useRef();

  const [theoData, setTheoData] = useState({ heures: 0, surfaceMoy: 0 });
  const [pratData, setPratData] = useState({ heures: 0, surfaceMoy: 0 });
  const [effectif, setEffectif] = useState([]); // [{ nom, totalGroupes, totalApprenants }]
  const [repartition, setRepartition] = useState({
    besoinTheoTotal: 0,
    besoinPratTotal: 0,
    moyenneTheo: 0,
    moyennePrat: 0,
  });

  const handleTheoChange = (salles) => {
    const total = (salles ?? []).reduce((acc, s = {}) => acc + (s.heuresMax ?? 0), 0);
    const moyenne =
      (salles && salles.length)
        ? (salles.reduce((acc, s = {}) => acc + (s.surfaceP ?? 0), 0) / salles.length)
        : 0;
    setTheoData({ heures: total, surfaceMoy: parseFloat(moyenne.toFixed(2)) });
  };

  const handlePratChange = (salles) => {
    const total = (salles ?? []).reduce((acc, s = {}) => acc + (s.heuresMax ?? 0), 0);
    const moyenne =
      (salles && salles.length)
        ? (salles.reduce((acc, s = {}) => acc + (s.surfaceP ?? 0), 0) / salles.length)
        : 0;
    setPratData({ heures: total, surfaceMoy: parseFloat(moyenne.toFixed(2)) });
  };

  // إصلاح عمليات الوصول للخصائص المتداخلة هنا
  const handleEffectifChange = (data) => {
    const result = (data ?? []).map((s = {}) => {
      const existant = s.existant ?? { groupes: 0, apprenants: 0 };
      const ajout = s.ajout ?? { groupes: 0, apprenants: 0 };

      return {
        nom: s.nom ?? "",
        totalGroupes:
          parseInt(existant?.groupes ?? 0) + parseInt(ajout?.groupes ?? 0),
        totalApprenants:
          parseInt(existant?.apprenants ?? 0) + parseInt(ajout?.apprenants ?? 0),
      };
    });
    setEffectif(result);
  };

  const handleRepartitionChange = (repData) => {
    const besoinTheoTotal = (repData ?? []).reduce((sum, r = {}) => sum + (r.besoinTheoTotal ?? 0), 0);
    const besoinPratTotal = (repData ?? []).reduce((sum, r = {}) => sum + (r.besoinPratTotal ?? 0), 0);
    const moyenneTheo =
      (repData && repData.length)
        ? ((repData.reduce((sum, r = {}) => sum + parseFloat(r.besoinTheoParGroupe ?? 0), 0)) / repData.length)
        : 0;
    const moyennePrat =
      (repData && repData.length)
        ? ((repData.reduce((sum, r = {}) => sum + parseFloat(r.besoinPratParGroupe ?? 0), 0)) / repData.length)
        : 0;
    setRepartition({
      besoinTheoTotal,
      besoinPratTotal,
      moyenneTheo: parseFloat(moyenneTheo.toFixed(2)),
      moyennePrat: parseFloat(moyennePrat.toFixed(2)),
    });
  };

  const resultatsData = {
    totalHeuresTheo: theoData.heures,
    totalHeuresPrat: pratData.heures,
    besoinTheoTotal: repartition.besoinTheoTotal,
    besoinPratTotal: repartition.besoinPratTotal,
    moyenneBesoinTheo: repartition.moyenneTheo,
    moyenneBesoinPrat: repartition.moyennePrat,
    moyenneSurfaceTheo: theoData.surfaceMoy,
    moyenneSurfacePrat: pratData.surfaceMoy,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div ref={pdfRef}>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Test de Dépassement Prévu
        </h1>

        <TableauSalles
          titre="Salles Théoriques"
          onDataChange={handleTheoChange}
        />
        <TableauSalles
          titre="Salles Pratiques"
          onDataChange={handlePratChange}
        />
        <TableauEffectif
          titre="Effectif Prévu"
          modeActuel={false}
          onDataChange={handleEffectifChange}
          data={effectif ?? []}
        />
        <TableauRepartition
          titre="Répartition Prévue des heures"
          effectifData={effectif ?? []}
          onDataChange={handleRepartitionChange}
        />

        {/* يمكنك عرض النتائج هنا إذا كنت ترغب */}
        {/* <ResultsDisplay data={resultatsData} /> */}
      </div>
    </div>
  );
}