import {
  calculerHeuresResultat,
  calculerApprenantsResultat,
  determinerEtat,
} from '../utils/calculs';

export default function TableauResultats({ titre, data }) {
  const {
    totalHeuresTheo,
    totalHeuresPrat,
    besoinTheoTotal,
    besoinPratTotal,
    moyenneBesoinTheo,
    moyenneBesoinPrat,
    moyenneSurfaceTheo,
    moyenneSurfacePrat,
  } = data;

  const heuresRestantesTheo = calculerHeuresResultat(totalHeuresTheo, besoinTheoTotal);
  const heuresRestantesPrat = calculerHeuresResultat(totalHeuresPrat, besoinPratTotal);

  const apprenantsPossiblesTheo = calculerApprenantsResultat(
    heuresRestantesTheo, moyenneBesoinTheo, moyenneSurfaceTheo
  );

  const apprenantsPossiblesPrat = calculerApprenantsResultat(
    heuresRestantesPrat, moyenneBesoinPrat, moyenneSurfacePrat
  );

  const etatTheo = determinerEtat(heuresRestantesTheo);
  const etatPrat = determinerEtat(heuresRestantesPrat);

  const testGlobal = etatTheo === 'Excédent' && etatPrat === 'Excédent' ? 'Excédent' : 'Dépassement';
  const couleurGlobal = testGlobal === 'Excédent' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>

      <table className="w-full table-auto border text-sm mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Type</th>
            <th className="border p-2">Heures restantes</th>
            <th className="border p-2">Apprenants possibles</th>
            <th className="border p-2">État</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Théorique</td>
            <td className="border p-2 text-center">{heuresRestantesTheo}</td>
            <td className="border p-2 text-center">{apprenantsPossiblesTheo}</td>
            <td className={`border p-2 text-center font-semibold ${etatTheo === 'Excédent' ? 'text-green-600' : 'text-red-600'}`}>
              {etatTheo}
            </td>
          </tr>
          <tr>
            <td className="border p-2">Pratique</td>
            <td className="border p-2 text-center">{heuresRestantesPrat}</td>
            <td className="border p-2 text-center">{apprenantsPossiblesPrat}</td>
            <td className={`border p-2 text-center font-semibold ${etatPrat === 'Excédent' ? 'text-green-600' : 'text-red-600'}`}>
              {etatPrat}
            </td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Test Global</td>
            <td colSpan="3" className={`border p-2 text-center font-bold ${couleurGlobal}`}>
              {testGlobal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
