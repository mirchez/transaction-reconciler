import jsPDF from 'jspdf';

export function generateTestReceiptPDF(): ArrayBuffer {
  const doc = new jsPDF();
  
  // Set font and initial position
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 20;
  const rightMargin = 20;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Company info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tech Solutions Inc.', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Innovation Drive', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text('San Francisco, CA 94103', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text('Phone: (415) 555-0123', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Add a line
  doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
  yPosition += 10;

  // Receipt details
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt #: TSI-2024-0115`, leftMargin, yPosition);
  yPosition += 6;
  doc.text(`Date: 2024-01-15`, leftMargin, yPosition);
  yPosition += 6;
  doc.text(`Time: 10:45 AM`, leftMargin, yPosition);
  yPosition += 10;

  // Add another line
  doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
  yPosition += 10;

  // Items header
  doc.setFont('helvetica', 'bold');
  doc.text('ITEMS PURCHASED:', leftMargin, yPosition);
  yPosition += 10;

  // Items
  doc.setFont('helvetica', 'normal');
  const items = [
    { name: 'Software License (Annual)', subtitle: '- Professional Edition', price: 299.99 },
    { name: '', subtitle: '- 1 User License', price: null },
    { name: 'Premium Support Package', subtitle: '- Priority Email Support', price: 49.99 },
    { name: '', subtitle: '- 24/7 Access', price: null }
  ];

  items.forEach((item) => {
    if (item.name) {
      doc.text(item.name, leftMargin, yPosition);
      if (item.price) {
        doc.text(`$${item.price.toFixed(2)}`, pageWidth - rightMargin - 30, yPosition);
      }
      yPosition += 6;
    }
    if (item.subtitle) {
      doc.setFontSize(9);
      doc.text(item.subtitle, leftMargin + 5, yPosition);
      doc.setFontSize(10);
      yPosition += 5;
    }
  });

  yPosition += 5;

  // Add line before totals
  doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
  yPosition += 8;

  // Totals
  const subtotal = 349.98;
  const tax = 29.75;
  const total = 379.73;

  doc.text('Subtotal:', pageWidth - rightMargin - 70, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - rightMargin - 30, yPosition);
  yPosition += 6;

  doc.text('Sales Tax (8.5%):', pageWidth - rightMargin - 70, yPosition);
  doc.text(`$${tax.toFixed(2)}`, pageWidth - rightMargin - 30, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Total:', pageWidth - rightMargin - 70, yPosition);
  doc.text(`$${total.toFixed(2)}`, pageWidth - rightMargin - 30, yPosition);
  yPosition += 15;

  // Payment method
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Payment Method: Credit Card ****1234', leftMargin, yPosition);
  yPosition += 5;
  doc.text('Transaction ID: TXN-20240115-1045', leftMargin, yPosition);
  yPosition += 10;

  // Add final line
  doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
  yPosition += 10;

  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for your purchase!', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text('Please keep this receipt for your records', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Small footer text
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Parsed Data: Date=2024-01-15, Amount=$379.73, Vendor=Tech Solutions Inc., Category=Software', pageWidth / 2, yPosition, { align: 'center' });

  // Return as ArrayBuffer
  return doc.output('arraybuffer');
}