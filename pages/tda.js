import { useRef, useState } from "react";
import TableauSalles from "../components/TableauSalles";
import TableauEffectif from "../components/TableauEffectif";
import TableauRepartition from "../components/TableauRepartition";
import TableauResultats from "../components/TableauResultats";
import useSpecialties from "../components/useSpecialties"; // <-- أضف هذا


export default function TDA() {
  const pdfRef = useRef();
  const [theoData, setTheoData] = useState({});
  const [pratData, setPratData] = useState({});
  const [effectif, setEffectif] = useState([]);
  const [repartition, setRepartition] = useState({});
  const specialties = useSpecialties(); // <-- أضف هذا

  const handleTheoChange = (data) => setTheoData(data);
  const handlePratChange = (data) => setPratData(data);
  const handleEffectifChange = (data) => setEffectif(data);

  const handleRepartitionChange = (repData) => {
    const besoinTheoTotal = (repData ?? []).reduce((sum, r = {}) => sum + (r.besoinTheoTotal ?? 0), 0);
    const besoinPratTotal = (repData ?? []).reduce((sum, r = {}) => sum + (r.besoinPratTotal ?? 0), 0);
    const moyenneTheo =
      repData?.length
        ? repData.reduce((sum, r = {}) => sum + parseFloat(r.besoinTheoParGroupe ?? 0), 0) / repData.length
        : 0;
    const moyennePrat =
      repData?.length
        ? repData.reduce((sum, r = {}) => sum + parseFloat(r.besoinPratParGroupe ?? 0), 0) / repData.length
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
          Test de Dépassement Actuel
        </h1>
        {/* جــدولان القاعات جنبًا إلى جنب */}
        <div className="flex gap-6 flex-wrap mb-8">
          <TableauSalles titre="Salles Théoriques" onDataChange={handleTheoChange} />
          <TableauSalles titre="Salles Pratiques" onDataChange={handlePratChange} />
        </div>
        <TableauEffectif
          titre="Effectif Actuel"
          specialties={specialties}
          modeActuel={true}
          onDataChange={handleEffectifChange}
          data={effectif ?? []}
        />
        <TableauRepartition titre="Répartition actuelle des heures" effectifData={effectif ?? []} onDataChange={handleRepartitionChange} />
        <TableauResultats titre="Résultat" data={resultatsData} />
      </div>
    </div>
  );
}