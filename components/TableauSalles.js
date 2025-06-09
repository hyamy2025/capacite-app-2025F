import React, { useState } from "react";

const TableauSalles = ({ type, salles, setSalles }) => {
  const [cnoCommun, setCnoCommun] = useState("");
  const [semainesCommun, setSemainesCommun] = useState("");

  const ajouterSalle = () => {
    const nouvelleSalle = {
      nom: "",
      surface: "",
      cno: cnoCommun,
      semaines: semainesCommun,
      heures: 0,
    };
    setSalles([...salles, nouvelleSalle]);
  };

  const supprimerSalle = (index) => {
    const nouvellesSalles = [...salles];
    nouvellesSalles.splice(index, 1);
    setSalles(nouvellesSalles);
  };

  const annulerModification = () => {
    if (salles.length > 1) {
      setSalles(salles.slice(0, -1));
    }
  };

  const handleChange = (index, field, value) => {
    const nouvellesSalles = [...salles];
    nouvellesSalles[index][field] = value;

    const surface = parseFloat(nouvellesSalles[index].surface) || 0;
    const cno = parseFloat(nouvellesSalles[index].cno) || 0;
    const semaines = parseFloat(nouvellesSalles[index].semaines) || 0;
    nouvellesSalles[index].heures = surface * cno * semaines;

    setSalles(nouvellesSalles);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">
        {type === "theorique" ? "Salles Théoriques" : "Salles Pratiques"}
      </h2>

      {/* Champs communs */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">CNO commun</label>
          <select
            value={cnoCommun}
            onChange={(e) => setCnoCommun(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="">--</option>
            <option value="0.5">0.5</option>
            <option value="0.6">0.6</option>
            <option value="0.7">0.7</option>
            <option value="0.8">0.8</option>
            <option value="0.9">0.9</option>
            <option value="1">1</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Semaines commun</label>
          <input
            type="number"
            value={semainesCommun}
            onChange={(e) => setSemainesCommun(e.target.value)}
            className="border p-1 rounded w-24"
          />
        </div>
      </div>

      {/* Tableau */}
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Surface pédagogique (m²)</th>
            <th className="border p-2">Heures</th>
            <th className="border p-2">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {salles.map((salle, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  type="text"
                  value={salle.nom}
                  onChange={(e) => handleChange(index, "nom", e.target.value)}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={salle.surface}
                  onChange={(e) =>
                    handleChange(index, "surface", e.target.value)
                  }
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2 text-center">{salle.heures}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => supprimerSalle(index)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Boutons */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={ajouterSalle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter une salle
        </button>
        <button
          onClick={annulerModification}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default TableauSalles;
