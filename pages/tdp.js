"use client";
import React, { useState } from "react";
import TableauSalles from "@/components/TableauSalles";
import TableauEffectif from "@/components/TableauEffectif";
import TableauRepartition from "@/components/TableauRepartition";
import TableauResultat from "@/components/TableauResultat";
import generatePDF from "@/components/generatePDF";
import { initialState } from "@/utils/initialState";

export default function TDP() {
  const [data, setData] = useState(initialState("tdp"));
  const [savedData, setSavedData] = useState(data);

  const handleCancel = () => {
    setData(savedData);
  };

  return (
    <main className="p-4 space-y-8">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Taux d’occupation des salles Pratiques
      </h1>

      <TableauSalles
        type="pratique"
        data={data}
        setData={setData}
      />

      <TableauEffectif data={data} setData={setData} />

      <TableauRepartition data={data} setData={setData} />

      <TableauResultat type="pratique" data={data} />

      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setSavedData(data)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sauvegarder
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Annuler
        </button>
        <button
          onClick={() => generatePDF(data, "pratique")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Télécharger PDF
        </button>
      </div>
    </main>
  );
}
