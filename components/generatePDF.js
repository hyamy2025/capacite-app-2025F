import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generatePDFWithTables({ titre, dataTables }) {
  const pdf = new jsPDF();

  // عنوان التقرير
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(titre, pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // تاريخ التوليد أسفل العنوان
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const dateGeneration = new Date().toLocaleDateString();
  pdf.text(`Date de génération : ${dateGeneration}`, 14, 28);

  let startY = 35; // بداية رسم الجداول تحت العنوان والتاريخ

  dataTables.forEach(({ title, columns, rows }) => {
    // عنوان الجدول
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 14, startY);
    startY += 6;

    // رسم الجدول
    pdf.autoTable({
      startY: startY,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        startY = data.cursor.y + 10;
      },
    });
  });

  // حفظ الملف
  const cleanTitle = titre.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${cleanTitle}_${dateStr}.pdf`;
  pdf.save(fileName);
}
