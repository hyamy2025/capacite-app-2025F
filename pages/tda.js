import { useRef, useState } from "react";
import TableauSalles from "../components/TableauSalles";
import TableauEffectif from "../components/TableauEffectif";
import TableauRepartition from "../components/TableauRepartition";
import TableauResultats from "../components/TableauResultats";
import useSpecialties from "../components/useSpecialties";

// يمكنك وضع هذه الدالة خارج المكون إذا كانت مستخدمة في أماكن أخرى
const defaultSalle = (cno, semaines, heures) => ({
  surface: '',
  cno,
  semaines,
  heures,
  surfaceP: 0,
  heuresMax: 0,
});

export default function TDA() {
  const pdfRef = useRef();

  // القاعات النظرية
  const [cnoTheo, setCnoTheo] = useState(1.0);
  const [semainesTheo, setSemainesTheo] = useState(72);
  const [heuresTheo, setHeuresTheo] = useState(56);
  const [sallesTheo, setSallesTheo] = useState([
    defaultSalle(1.0, 72, 56)
  ]);

  // القاعات التطبيقية
  const [cnoPrat, setCnoPrat] = useState(1.0);
  const [semainesPrat, setSemainesPrat] = useState(72);
  const [heuresPrat, setHeuresPrat] = useState(56);
  const [sallesPrat, setSallesPrat] = useState([
    defaultSalle(1.0, 72, 56)
  ]);

  // قاعات TP Spécifiques
  const [cnoTPS, setCnoTPS] = useState(1.0);
  const [semainesTPS, setSemainesTPS] = useState(72);
  const [heuresTPS, setHeuresTPS] = useState(56);
  const [sallesTPS, setSallesTPS] = useState([
    defaultSalle(1.0, 72, 56)
  ]);

  // بيانات أخرى
  const [theoData, setTheoData] = useState({ heures: 0, surfaceMoy: 0 });
  const [pratData, setPratData] = useState({ heures: 0, surfaceMoy: 0 });
  const [effectif, setEffectif] = useState([
    { specialite: "", groupes: 0, apprenants: 0 }
  ]);
  const [repartition, setRepartition] = useState({
    besoinTheoTotal: 0,
    besoinPratTotal: 0,
    moyenneTheo: 0,
    moyennePrat: 0,
  });
  const specialties = useSpecialties();

  // تجميع بيانات
  const handleTheoChange = (data) =>
    setTheoData({
      heures: data?.heures ?? 0,
      surfaceMoy: data?.surfaceMoy ?? 0,
    });
  const handlePratChange = (data) =>
    setPratData({
      heures: data?.heures ?? 0,
      surfaceMoy: data?.surfaceMoy ?? 0,
    });

  const handleEffectifChange = (rows) => {
    if (!rows || rows.length === 0) {
      setEffectif([{ specialite: "", groupes: 0, apprenants: 0 }]);
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

  // تمرير القاعات بالطريقة الجديدة الموحدة
  const sallesObj = {
    theorie: sallesTheo,
    pratique: sallesPrat,
    tpSpecifiques: sallesTPS,
  };
  const setSallesObj = (newSalles) => {
    setSallesTheo(newSalles.theorie || []);
    setSallesPrat(newSalles.pratique || []);
    setSallesTPS(newSalles.tpSpecifiques || []);
  };

  const cnos = {
    theorie: cnoTheo,
    pratique: cnoPrat,
    tpSpecifiques: cnoTPS,
  };
  const setCnos = (newCnos) => {
    setCnoTheo(newCnos.theorie ?? 1.0);
    setCnoPrat(newCnos.pratique ?? 1.0);
    setCnoTPS(newCnos.tpSpecifiques ?? 1.0);
  };

  const semaines = {
    theorie: semainesTheo,
    pratique: semainesPrat,
    tpSpecifiques: semainesTPS,
  };
  const setSemainesAll = (newSemaines) => {
    setSemainesTheo(newSemaines.theorie ?? 72);
    setSemainesPrat(newSemaines.pratique ?? 72);
    setSemainesTPS(newSemaines.tpSpecifiques ?? 72);
  };

  const heures = {
    theorie: heuresTheo,
    pratique: heuresPrat,
    tpSpecifiques: heuresTPS,
  };
  const setHeuresAll = (newHeures) => {
    setHeuresTheo(newHeures.theorie ?? 56);
    setHeuresPrat(newHeures.pratique ?? 56);
    setHeuresTPS(newHeures.tpSpecifiques ?? 56);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div ref={pdfRef}>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Test de Dépassement Actuel
        </h1>
        <div className="flex gap-6 flex-wrap mb-8">
          <TableauSalles
            salles={sallesObj}
            setSalles={setSallesObj}
            cnos={cnos}
            setCnos={setCnos}
            semaines={semaines}
            setSemaines={setSemainesAll}
            heures={heures}
            setHeures={setHeuresAll}
            onDataChange={handleTheoChange}
          />
        </div>
        <TableauEffectif
          titre="Effectif Actuel"
          specialties={specialties}
          modeActuel={true}
          onDataChange={handleEffectifChange}
          data={effectif}
        />
        <TableauRepartition
          titre="Répartition actuelle des heures"
          effectifData={effectif}
          specialties={specialties}
          onDataChange={handleRepartitionChange}
        />
        <TableauResultats titre="Résultat" data={resultatsData} />
      </div>
    </div>
  );
}