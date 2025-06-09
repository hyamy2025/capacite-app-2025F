"use client";
import React, { useState } from "react";
import TableauSalles from "@/components/TableauSalles";

const TDA = () => {
  const [sallesTheoriques, setSallesTheoriques] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tableau des Données - Théorique
      </h1>
      <TableauSalles
        type="theorique"
        salles={sallesTheoriques}
        setSalles={setSallesTheoriques}
      />
    </div>
  );
};

export default TDA;
