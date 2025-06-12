// components/generatePDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF({ tables, page }) {
  const doc = new jsPDF();

  const titre =
    page === "tda"
      ? "Rapport de diagnostic de la capacité d'accueil actuelle"
      : "Rapport de diagnostic de la capacité d'accueil prévue";

  doc.setFontSize(14);
  doc.text(titre, 105, 15, { align: "center" });

  let finalY = 25;

  tables.forEach(({ titre, colonnes, lignes }) => {
    doc.setFontSize(11);
    doc.text(titre, 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [colonnes],
      body: lignes,
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
      theme: "grid",
      didDrawPage: (data) => {
        finalY = data.cursor.y + 10;
      },
    });
  });

  doc.save("rapport.pdf");
}
