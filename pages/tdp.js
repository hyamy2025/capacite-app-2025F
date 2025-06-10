import { useRef, useState } from "react";
import TableauSalles from "../components/TableauSalles";
import TableauEffectif from "../components/TableauEffectif";
import TableauRepartition from "../components/TableauRepartition";
import TableauResultats from "../components/TableauResultats";
import useSpecialties from "../components/useSpecialties";

export default function TDP() {
  const pdfRef = useRef();
  const [theoData, setTheoData] = useState({});
  const [pratData, setPratData] = useState({});
  const [effectif, setEffectif] = useState([
    { specialite: "", groupes: 0, apprenants: 0 }
  ]);
  const specialties = useSpecialties();

  const handleTheoChange = (data) => setTheoData(data);
  const handlePratChange = (data) => setPratData(data);
  const handleEffectifChange = (rows) => {
    if (!rows || rows.length === 0) {
      setEffectif([{ specialite: "", groupes: 0, apprenants: 0 }]);
    } else {
      setEffectif(rows);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div ref={pdfRef}>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Test de Dépassement Prévu
        </h1>
        <div className="flex gap-6 flex-wrap mb-8">
          <TableauSalles titre="Salles Théoriques" onDataChange={handleTheoChange} />
          <TableauSalles titre="Salles Pratiques" onDataChange={handlePratChange} />
        </div>
        <TableauEffectif
          titre="Effectif Prévu"
          specialties={specialties}
          modeActuel={false}
          onDataChange={handleEffectifChange}
          data={effectif}
        />
        <TableauRepartition
          titre="Répartition Prévue des heures"
          effectifData={effectif}
          specialties={specialties}
        />
        <TableauResultats titre="Résultat" />
      </div>
    </div>
  );
}