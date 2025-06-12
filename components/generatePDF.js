import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF({ titre, ref }) {
  const element = ref.current;
  if (!element) return;

  try {
    // Capture de l’élément en image
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Données supplémentaires
    const nomStructure = localStorage.getItem('nomStructure') || 'Structure inconnue';
    const numEnregistrement = localStorage.getItem('numEnregistrement') || '---';
    const dateGeneration = new Date().toLocaleDateString();

    // Chargement du logo (doit exister dans public/)
    const logoUrl = '/logo-ministere.png';
    const logo = await new Promise((resolve, reject) => {
      const img = new Image();
      img.src = logoUrl;
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

    // Convertir logo en DataURL
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = logo.width;
    logoCanvas.height = logo.height;
    const ctx = logoCanvas.getContext('2d');
    ctx.drawImage(logo, 0, 0);
    const logoData = logoCanvas.toDataURL('image/png');

    // Affichage du logo
    pdf.addImage(logoData, 'PNG', 10, 10, 20, 20); // Taille ajustée à 20x20mm

    // Titre centré
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(titre, pageWidth / 2, 20, { align: 'center' });

    // Infos complémentaires
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50); // Gris foncé
    pdf.text(`Nom de la structure : ${nomStructure}`, 50, 30);
    pdf.text(`N° d'enregistrement : ${numEnregistrement}`, 50, 36);
    pdf.text(`Date de génération : ${dateGeneration}`, 50, 42);
    pdf.setTextColor(0); // Revenir au noir

    // Image principale (contenu capturé)
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 10, 55, pdfWidth, pdfHeight);

    // Nom de fichier personnalisé
    const cleanTitle = titre.replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${cleanTitle}_${nomStructure.replace(/\s+/g, '_')}_${dateStr}.pdf`;

    // Sauvegarde du PDF
    pdf.save(fileName);
  } catch (error) {
    alert("Erreur lors de la création du PDF. Veuillez réessayer.");
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }
}
