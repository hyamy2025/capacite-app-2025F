import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF({ titre, ref }) {
  const element = ref.current;
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Données supplémentaires
    const nomStructure = localStorage.getItem('nomStructure') || 'Structure inconnue';
    const numEnregistrement = localStorage.getItem('numEnregistrement') || '---';
    const dateGeneration = new Date().toLocaleDateString();

    // Titre au centre
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(titre, pageWidth / 2, 20, { align: 'center' });

    // Infos supplémentaires
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nom de la structure : ${nomStructure}`, 50, 30);
    pdf.text(`N° d'enregistrement : ${numEnregistrement}`, 50, 36);
    pdf.text(`Date de génération : ${dateGeneration}`, 50, 42);

    // Image principale (contenu)
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 55, pdfWidth, pdfHeight);

    // Nom de fichier personnalisé
    const cleanTitle = titre.replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${cleanTitle}_${nomStructure.replace(/\s+/g, '_')}_${dateStr}.pdf`;

    pdf.save(fileName);
  } catch (error) {
    alert("Erreur lors de la création du PDF. Veuillez réessayer.");
    console.error(error);
  }
}
