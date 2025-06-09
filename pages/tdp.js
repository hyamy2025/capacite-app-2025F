"use client";
import React, { useState } from "react";
import TableauSalles from "@/components/TableauSalles";

const TDP = () => {
  const [sallesPratiques, setSallesPratiques] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tableau des Données - Pratique
      </h1>
      <TableauSalles
        type="pratique"
        salles={sallesPratiques}
        setSalles={setSallesPratiques}
      />
    </div>
  );
};

export default TDP;
