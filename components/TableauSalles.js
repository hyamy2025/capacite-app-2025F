import React from "react";
import {
  calculerSurfacePedagogique,
  calculerHeuresMax,
  moyenneColonne,
  sommeColonne
} from "../utils/calculs";

const defaultSalle = (cno, semaines, heures) => ({
  surface: "",
  cno,
  semaines,
  heures,
  surfaceP: 0,
  heuresMax: calculerHeuresMax(semaines, heures),
});

const salleTitles = [
  { key: "theorie", label: "Salles Théorie" },
  { key: "pratique", label: "Salles Pratique" },
  { key: "tpSpecifiques", label: "Salles TP Spécifiques" },
];

export default function TableauSalles({
  salles,
  setSalles,
  cnos,
  setCnos,
  semaines,
  setSemaines,
  heures,
  setHeures,
}) {
  // حماية ضد undefined لأي نوع قاعة
  const safeSalles = {
    theorie: salles?.theorie || [],
    pratique: salles?.pratique || [],
    tpSpecifiques: salles?.tpSpecifiques || [],
  };

  const handleChange = (type, index, field, value) => {
    const newSalles = {
      ...safeSalles,
      [type]: [...(safeSalles[type] || [])],
    };
    newSalles[type][index][field] = value;
    if (field === "surface") {
      newSalles[type][index].surfaceP = calculerSurfacePedagogique(
        parseFloat(newSalles[type][index].surface || 0),
        parseFloat(newSalles[type][index].cno)
      );
    }
    newSalles[type][index].heuresMax = calculerHeuresMax(
      newSalles[type][index].semaines,
      newSalles[type][index].heures
    );
    setSalles({ ...salles, ...newSalles });
  };

  const updateCno = (type, value) => {
    const newCnos = { ...cnos, [type]: value };
    setCnos(newCnos);
    setSalles((prev) => {
      const ns = {
        ...safeSalles,
        [type]: (safeSalles[type] || []).map((salle) => ({
          ...salle,
          cno: value,
          surfaceP: calculerSurfacePedagogique(
            parseFloat(salle.surface || 0),
            parseFloat(value)
          ),
        })),
      };
      return { ...prev, ...ns };
    });
  };

  const updateSemaines = (type, value) => {
    const newSemaines = { ...semaines, [type]: value };
    setSemaines(newSemaines);
    setSalles((prev) => {
      const ns = {
        ...safeSalles,
        [type]: (safeSalles[type] || []).map((salle) => ({
          ...salle,
          semaines: value,
          heuresMax: calculerHeuresMax(value, salle.heures),
        })),
      };
      return { ...prev, ...ns };
    });
  };

  const updateHeures = (type, value) => {
    const newHeures = { ...heures, [type]: value };
    setHeures(newHeures);
    setSalles((prev) => {
      const ns = {
        ...safeSalles,
        [type]: (safeSalles[type] || []).map((salle) => ({
          ...salle,
          heures: value,
          heuresMax: calculerHeuresMax(salle.semaines, value),
        })),
      };
      return { ...prev, ...ns };
    });
  };

  const ajouterSalle = (type) => {
    setSalles((prev) => ({
      ...safeSalles,
      [type]: [
        ...(safeSalles[type] || []),
        defaultSalle(cnos[type], semaines[type], heures[type]),
      ],
    }));
  };

  const annulerModification = (type) => {
    setSalles((prev) => {
      if ((safeSalles[type] || []).length > 1) {
        return {
          ...safeSalles,
          [type]: safeSalles[type].slice(0, -1),
        };
      } else {
        return {
          ...safeSalles,
          [type]: [
            defaultSalle(cnos[type], semaines[type], heures[type]),
          ],
        };
      }
    });
  };

  // Options
  const heuresOptions = [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60];
  const cnoOptions = Array.from({ length: 21 }, (_, i) => (1 + i * 0.1).toFixed(1));
  const semainesOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="flex gap-4 w-full">
      {salleTitles.map(({ key, label }) => {
        const sallesType = safeSalles[key] || [];
        const totalHeuresMax = sommeColonne(sallesType.map(s => Number(s.heuresMax) || 0));
        const moyenneSurfaceP = moyenneColonne(sallesType.map(s => Number(s.surfaceP) || 0));
        return (
          <div className="bg-white shadow rounded-2xl p-4 mb-8 flex-1" key={key}>
            <h2 className="text-xl font-bold text-gray-700 mb-4">{label}</h2>
            <div style={{ marginBottom: 16, display: "flex", gap: "2rem" }}>
              <label>
                CNO:
                <select
                  value={cnos[key]}
                  onChange={(e) => updateCno(key, Number(e.target.value))}
                  style={{ marginLeft: 8, width: 80 }}
                >
                  {cnoOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
              <label>
                Semaines:
                <select
                  value={semaines[key]}
                  onChange={(e) => updateSemaines(key, Number(e.target.value))}
                  style={{ marginLeft: 8, width: 80 }}
                >
                  {semainesOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
              <label>
                Heures:
                <select
                  value={heures[key]}
                  onChange={(e) => updateHeures(key, Number(e.target.value))}
                  style={{ marginLeft: 8, width: 80 }}
                >
                  {heuresOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            </div>
            <table className="w-full table-auto border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Code</th>
                  <th className="border p-2">Surface (m²)</th>
                  <th className="border p-2">Surface Pédagogique</th>
                  <th className="border p-2">Heures Max</th>
                </tr>
              </thead>
              <tbody>
                {sallesType.map((salle, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={salle.surface}
                        onChange={(e) => handleChange(key, index, 'surface', e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2 text-center">{salle.surfaceP}</td>
                    <td className="border p-2 text-center">{salle.heuresMax}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="border p-2 text-center" colSpan={2}>
                    Moyenne / Somme
                  </td>
                  <td className="border p-2 text-center">{moyenneSurfaceP}</td>
                  <td className="border p-2 text-center">{totalHeuresMax}</td>
                </tr>
              </tfoot>
            </table>
            <div className="flex gap-4 mt-4 justify-center">
              <button
                className="bg-blue-500 text-white rounded px-3 py-1"
                onClick={() => ajouterSalle(key)}
              >
                Ajouter salle
              </button>
              <button
                className="bg-gray-300 text-gray-700 rounded px-3 py-1"
                onClick={() => annulerModification(key)}
              >
                Annuler
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}