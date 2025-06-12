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

    pdf.setFontSize(18);
    pdf.text(titre, pageWidth / 2, 20, { align: 'center' });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth, pdfHeight);

    pdf.save('test.pdf');
  } catch (error) {
    alert("Erreur lors de la création du PDF. Veuillez réessayer.");
    console.error(error);
  }
}
