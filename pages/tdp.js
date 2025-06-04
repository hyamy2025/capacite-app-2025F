import { useState, useRef } from 'react';
import TableauSalles from '../components/TableauSalles';
import TableauEffectif from '../components/TableauEffectif';
import TableauRepartition from '../components/TableauRepartition';
import TableauResultats from '../components/TableauResultats';
import { generatePDF } from '../components/generatePDF';
import { useRouter } from 'next/router';

export default function TDP() {
  const router = useRouter();
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
    const total = salles.reduce((acc, s) => acc + (s.heuresMax || 0), 0);
    const moyenne = salles.length
      ? salles.reduce((acc, s) => acc + (s.surfaceP || 0), 0) / salles.length
      : 0;
    setTheoData({ heures: total, surfaceMoy: parseFloat(moyenne.toFixed(2)) });
  };

  const handlePratChange = (salles) => {
    const total = salles.reduce((acc, s) => acc + (s.heuresMax || 0), 0);
    const moyenne = salles.length
      ? salles.reduce((acc, s) => acc + (s.surfaceP || 0), 0) / salles.length
      : 0;
    setPratData({ heures: total, surfaceMoy: parseFloat(moyenne.toFixed(2)) });
  };

  const handleEffectifChange = (data) => {
    const result = data.map((s) => {
  const existant = s.existant || { groupes: 0, apprenants: 0 };
  const ajout = s.ajout || { groupes: 0, apprenants: 0 };

  return {
    nom: s.nom,
    totalGroupes:
      parseInt(existant.groupes || 0) + parseInt(ajout.groupes || 0),
    totalApprenants:
      parseInt(existant.apprenants || 0) + parseInt(ajout.apprenants || 0),
  };
});
    setEffectif(result);
  };

  const handleRepartitionChange = (repData) => {
    const besoinTheoTotal = repData.reduce((sum, r) => sum + r.besoinTheoTotal, 0);
    const besoinPratTotal = repData.reduce((sum, r) => sum + r.besoinPratTotal, 0);
    const moyenneTheo = repData.length
      ? repData.reduce((sum, r) => sum + parseFloat(r.besoinTheoParGroupe || 0), 0) /
        repData.length
      : 0;
    const moyennePrat = repData.length
      ? repData.reduce((sum, r) => sum + parseFloat(r.besoinPratParGroupe || 0), 0) /
        repData.length
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
        />
        <TableauRepartition
          titre="Répartition Prévue des heures"
          effectifData={effectif}
          onDataChange={handleRepartitionChange}
        />
        <TableauResultats titre="Résultat" data={resultatsData} />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() =>
            generatePDF({ titre: 'Test de Dépassement Prévu', ref: pdfRef })
          }
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl"
        >
          Télécharger Résultat
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl"
        >
          Retour à l&apos;Accueil
        </button>
      </div>
    </div>
  );
}
