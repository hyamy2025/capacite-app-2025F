import { useRef, useState } from "react";
import TableauSalles from "../components/TableauSalles";
import TableauEffectif from "../components/TableauEffectif";
import TableauRepartition from "../components/TableauRepartition";
import TableauResultats from "../components/TableauResultats";
import useSpecialties from "../components/useSpecialties";

export default function TDP() {
  const pdfRef = useRef();
  // الحالة الخاصة بساعات القاعات النظرية
  const [cnoTheo, setCnoTheo] = useState(1.0);
  const [semainesTheo, setSemainesTheo] = useState(72);
  const [heuresTheo, setHeuresTheo] = useState(56);
  const [sallesTheo, setSallesTheo] = useState([
    { surface: '', cno: 1.0, semaines: 72, heures: 56, surfaceP: 0, heuresMax: 0 },
  ]);
  // الحالة الخاصة بساعات القاعات التطبيقية
  const [cnoPrat, setCnoPrat] = useState(1.0);
  const [semainesPrat, setSemainesPrat] = useState(72);
  const [heuresPrat, setHeuresPrat] = useState(56);
  const [sallesPrat, setSallesPrat] = useState([
    { surface: '', cno: 1.0, semaines: 72, heures: 56, surfaceP: 0, heuresMax: 0 },
  ]);

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

  // اجمع الساعات ومتوسط المساحة من جدول القاعات النظرية
  const handleTheoChange = (data) =>
    setTheoData({
      heures: data?.heures ?? 0,
      surfaceMoy: data?.surfaceMoy ?? 0,
    });
  // اجمع الساعات ومتوسط المساحة من جدول القاعات التطبيقية
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

  // التقاط أول عنصر من مصفوفة بيانات التوزيع
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
            titre="Salles Théoriques"
            salles={sallesTheo}
            setSalles={setSallesTheo}
            cno={cnoTheo}
            setCno={setCnoTheo}
            semaines={semainesTheo}
            setSemaines={setSemainesTheo}
            heures={heuresTheo}
            setHeures={setHeuresTheo}
            onDataChange={handleTheoChange}
          />
          <TableauSalles
            titre="Salles Pratiques"
            salles={sallesPrat}
            setSalles={setSallesPrat}
            cno={cnoPrat}
            setCno={setCnoPrat}
            semaines={semainesPrat}
            setSemaines={setSemainesPrat}
            heures={heuresPrat}
            setHeures={setHeuresPrat}
            onDataChange={handlePratChange}
          />
        </div>
        <TableauEffectif
          titre="Effectif Prévu"
          specialties={specialties}
          modeActuel={false}
          onDataChange={handleEffectifChange}
          data={effectif}
          moyenneSurfaceTheo={theoData.surfaceMoy} // تمرير معدل Surface Pédagogique النظري
        />
        <TableauRepartition
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