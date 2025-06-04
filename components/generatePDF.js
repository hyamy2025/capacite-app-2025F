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

    // === Informations générales ===
    const nomStructure = localStorage.getItem('nomStructure') || 'Structure inconnue';
    const numEnregistrement = localStorage.getItem('numEnregistrement') || '---';

    // === Titre + Infos ===
    pdf.setFontSize(16);
    pdf.text(titre, pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Nom de la structure : ${nomStructure}`, 20, 30);
    pdf.text(`N° d'enregistrement : ${numEnregistrement}`, 20, 37);

    // === Capture HTML en image ===
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 45, pdfWidth, pdfHeight);
    pdf.save(`${titre.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Erreur PDF:', error);
  }
}

