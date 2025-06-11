import { useRef, useState } from "react";
import TableauSalles from "../components/TableauSalles";
import TableauEffectifAjout from "../components/TableauEffectifAjout";
import TableauRepartitionAjout from "../components/TableauRepartitionAjout";
import TableauResultats from "../components/TableauResultats";
import useSpecialties from "../components/useSpecialties";

const defaultSalle = (cno, semaines, heures) => ({
  surface: "",
  cno,
  semaines,
  heures,
  surfaceP: 0,
  heuresMax: Math.round(semaines * heures),
});

export default function TDP() {
  const pdfRef = useRef();

  // حالات الجداول الثلاثة (نظرية - تطبيقية - TP spécifiques)
  const [salles, setSalles] = useState({
    theorie: [defaultSalle(1.0, 72, 56)],
    pratique: [defaultSalle(1.0, 72, 56)],
    tpSpecifiques: [defaultSalle(1.0, 72, 56)],
  });

  const [cnos, setCnos] = useState({
    theorie: 1.0,
    pratique: 1.0,
    tpSpecifiques: 1.0,
  });
  const [semaines, setSemaines] = useState({
    theorie: 72,
    pratique: 72,
    tpSpecifiques: 72,
  });
  const [heures, setHeures] = useState({
    theorie: 56,
    pratique: 56,
    tpSpecifiques: 56,
  });

  const [theoData, setTheoData] = useState({ heures: 0, surfaceMoy: 0 });
  const [pratData, setPratData] = useState({ heures: 0, surfaceMoy: 0 });
  const [effectif, setEffectif] = useState([
    { specialite: "", groupes: 0, groupesAjout: 0, apprenants: 0 }
  ]);
  const [repartition, setRepartition] = useState({
    besoinTheoTotal: 0,
    besoinPratTotal: 0,
    moyenneTheo: 0,
    moyennePrat: 0,
  });
  const specialties = useSpecialties();

  // استجابة تغيير القاعات النظرية
  const handleTheoChange = (data) =>
    setTheoData({
      heures: data?.heures ?? 0,
      surfaceMoy: data?.surfaceMoy ?? 0,
    });
  // استجابة تغيير القاعات التطبيقية (يمكنك ربطها إذا أردت)
  const handlePratChange = (data) =>
    setPratData({
      heures: data?.heures ?? 0,
      surfaceMoy: data?.surfaceMoy ?? 0,
    });

  const handleEffectifChange = (rows) => {
    if (!rows || rows.length === 0) {
      setEffectif([{ specialite: "", groupes: 0, groupesAjout: 0, apprenants: 0 }]);
    } else {
      setEffectif(rows);
    }
  };

  const handleRepartitionChange = (repData) => {
    const r = (Array.isArray(repData) && repData.length > 0) ? repData[0] : {};
    setRepartition({
      besoinTheoTotal: r.besoinTheoTotal ?? 0,
      besoinPratTotal: r.besoinPratTotal ?? 0,
      moyenneTheo: r.besoinTheoParGroupe ?? 0,
      moyennePrat: r.besoinPratParGroupe ?? 0,
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
        <div className="flex gap-6 flex-wrap mb-8">
          <TableauSalles
            salles={salles}
            setSalles={setSalles}
            cnos={cnos}
            setCnos={setCnos}
            semaines={semaines}
            setSemaines={setSemaines}
            heures={heures}
            setHeures={setHeures}
            onDataChange={handleTheoChange}
          />
        </div>
        <TableauEffectifAjout
          titre="Effectif Prévu"
          specialties={specialties}
          modeActuel={false}
          onDataChange={handleEffectifChange}
          data={effectif}
          moyenneSurfaceTheo={theoData.surfaceMoy}
        />
        <TableauRepartitionAjout
          titre="Répartition Prévue des heures"
          effectifData={effectif}
          specialties={specialties}
          onDataChange={handleRepartitionChange}
        />
        <TableauResultats titre="Résultat" data={resultatsData} />
      </div>
    </div>
  );
}