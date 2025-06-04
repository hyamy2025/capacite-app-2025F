import { useState } from 'react';
import { sommeColonne } from '../utils/calculs';

export default function TableauEffectif({ titre, modeActuel = true }) {
  const [specialites, setSpecialites] = useState([
    {
      nom: '',
      sessions: modeActuel
        ? [{ nom: '', groupes: '', apprenants: '' }]
        : {
            existant: { groupes: '', apprenants: '' },
            ajout: { groupes: '', apprenants: 0 },
            total: { groupes: 0, apprenants: 0 },
          },
    },
  ]);
  const [historique, setHistorique] = useState([]);

  const handleChange = (index, type, field, value, sessionIdx = null) => {
    const newData = [...specialites];
    if (modeActuel) {
      if (type === 'nom') {
        newData[index].nom = value;
      } else {
        newData[index].sessions[sessionIdx][field] = value;
      }
    } else {
      newData[index][type][field] = value;

      // Calcul automatique du champ "ajout.apprenants" et "total"
      const ajoutGroupes = parseInt(newData[index].ajout.groupes || 0);
      const surfaceMoyenne = 26; // Peut être adapté
      newData[index].ajout.apprenants = ajoutGroupes * surfaceMoyenne;

      newData[index].total.groupes =
        parseInt(newData[index].existant.groupes || 0) + ajoutGroupes;
      newData[index].total.apprenants =
        parseInt(newData[index].existant.apprenants || 0) +
        newData[index].ajout.apprenants;
    }
    setHistorique([...historique, specialites]);
    setSpecialites(newData);
  };

  const ajouterSpecialite = () => {
    setHistorique([...historique, specialites]);
    setSpecialites([
      ...specialites,
      {
        nom: '',
        sessions: modeActuel
          ? [{ nom: '', groupes: '', apprenants: '' }]
          : {
              existant: { groupes: '', apprenants: '' },
              ajout: { groupes: '', apprenants: 0 },
              total: { groupes: 0, apprenants: 0 },
            },
      },
    ]);
  };

  const ajouterSession = (index) => {
    const newData = [...specialites];
    newData[index].sessions.push({ nom: '', groupes: '', apprenants: '' });
    setSpecialites(newData);
  };

  const annuler = () => {
    if (historique.length > 0) {
      const dernier = historique[historique.length - 1];
      setSpecialites(dernier);
      setHistorique(historique.slice(0, -1));
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{titre}</h2>

      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Spécialité</th>
            {modeActuel ? (
              <>
                <th className="border p-2">Session</th>
                <th className="border p-2">Nb Groupes</th>
                <th className="border p-2">Nb Apprenants</th>
              </>
            ) : (
              <>
                <th className="border p-2">Existant<br />Groupes / Appr.</th>
                <th className="border p-2">Ajout<br />Groupes / Appr.</th>
                <th className="border p-2">Total<br />Groupes / Appr.</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {specialites.map((spec, idx) => (
            modeActuel ? (
              spec.sessions.map((sess, sidx) => (
                <tr key={`${idx}-${sidx}`}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={spec.nom}
                      onChange={(e) => handleChange(idx, 'nom', null, e.target.value)}
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={sess.nom}
                      onChange={(e) => handleChange(idx, null, 'nom', e.target.value, sidx)}
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={sess.groupes}
                      onChange={(e) => handleChange(idx, null, 'groupes', e.target.value, sidx)}
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={sess.apprenants}
                      onChange={(e) => handleChange(idx, null, 'apprenants', e.target.value, sidx)}
                      className="w-full border p-1 rounded"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr key={idx}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={spec.nom}
                    onChange={(e) => handleChange(idx, 'nom', null, e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border p-2 text-center">
                  {['groupes', 'apprenants'].map(f => (
                    <input
                      key={f}
                      type="number"
                      value={spec.existant[f]}
                      onChange={(e) => handleChange(idx, 'existant', f, e.target.value)}
                      className="w-1/2 border p-1 rounded m-1"
                    />
                  ))}
                </td>
                <td className="border p-2 text-center">
                  {['groupes', 'apprenants'].map(f => (
                    <input
                      key={f}
                      type="number"
                      value={spec.ajout[f]}
                      onChange={(e) => handleChange(idx, 'ajout', f, e.target.value)}
                      className="w-1/2 border p-1 rounded m-1"
                    />
                  ))}
                </td>
                <td className="border p-2 text-center">
                  {['groupes', 'apprenants'].map(f => (
                    <span key={f} className="block">
                      {spec.total[f]}
                    </span>
                  ))}
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <div className="text-sm text-gray-700">
          <p>
            <strong>Total Groupes:</strong>{' '}
            {modeActuel
              ? sommeColonne(
                  specialites.flatMap((s) =>
                    s.sessions.map((sess) => parseInt(sess.groupes || 0))
                  )
                )
              : sommeColonne(specialites.map((s) => s.total.groupes))}
          </p>
          <p>
            <strong>Total Apprenants:</strong>{' '}
            {modeActuel
              ? sommeColonne(
                  specialites.flatMap((s) =>
                    s.sessions.map((sess) => parseInt(sess.apprenants || 0))
                  )
                )
              : sommeColonne(specialites.map((s) => s.total.apprenants))}
          </p>
        </div>
        <div className="flex gap-2">
          {modeActuel && (
            <button
              onClick={() => ajouterSession(0)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Ajouter une session
            </button>
          )}
          <button
            onClick={ajouterSpecialite}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Ajouter spécialité
          </button>
          <button
            onClick={annuler}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
