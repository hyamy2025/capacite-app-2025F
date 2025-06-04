import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF({ titre, ref }) {
  const element = ref.current;

  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.setFontSize(16);
    pdf.text(titre, pageWidth / 2, 20, { align: 'center' });

    const logoUrl = '/logo.png';
    const logoImg = await loadImage(logoUrl);
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = logoImg.width;
    logoCanvas.height = logoImg.height;
    const ctx = logoCanvas.getContext('2d');
    ctx.drawImage(logoImg, 0, 0);
    const logoData = logoCanvas.toDataURL('image/png');
    pdf.addImage(logoData, 'PNG', 10, 10, 30, 30);

    pdf.addImage(imgData, 'PNG', 10, 50, pdfWidth, pdfHeight);

    pdf.save(`${titre.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error);
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
