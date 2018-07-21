import PDFDoc from 'pdfkit';
import { calcAmount, calcTotalAmount } from './util';

export function createInvoice(pipe, invoice, options) {
  options = options || {};
  options.currencySymbol = options.currencySymbol || '$';

  const black = '#000',
    darkGrey = '#696969',
    medGrey = '#ddd';

  const mainFont = 'Helvetica';

  const doc = new PDFDoc();

  doc.pipe(pipe);

  const tableDividerLine = function(doc, y) {
    doc.save()
      .rect(45, y, 515, 1)
      .fill(medGrey)
      .restore();
    return doc;
  };

  doc.font(mainFont + '-Bold', 26)

    // Title
    .fillColor(black)
    .text('INVOICE', 50, 50, {
      stroke: false
    })

    // Entity Name
    .font(mainFont, 9)
    .fillColor(darkGrey)
    .text('From', 390, 60)

    .font(mainFont + '-Bold', 10)
    .fillColor(black)
    .text(invoice.entity_name, 425, 60)

    // Line separator
    .save()
    .rect(418, 55, 1, 20)
    .fill(medGrey)
    .restore()

    // Entity Address
    .font(mainFont, 8)
    .fillColor(darkGrey)
    .text(invoice.entity_address, 425, 80)

    // Invoice Info
    .font(mainFont, 9)
    .fillColor(darkGrey)
    .text('Invoice ID', 50, 135)
    .text('Issue Date', 50, 155)
    .text('Due Date', 50, 175)
    .text('Subject', 50, 195)

    .font(mainFont + '-Bold', 9)
    .fillColor(black)
    .text(invoice.invoice_id, 120, 135)
    .font(mainFont, 9)
    .text(invoice.issue_date, 120, 155)
    .text(invoice.due_date, 120, 175)
    .text(invoice.subject, 120, 195)

    // Client name
    .font(mainFont, 9)
    .fillColor(darkGrey)
    .text('Invoice For', 365, 135)

    .font(mainFont + '-Bold', 10)
    .fillColor(black)
    .text(invoice.client_name, 425, 135, {
      lineBreak: false
    })

    // Line separator
    .save()
    .rect(418, 130, 1, 20)
    .fill(medGrey)
    .restore()

    // Line Separator
    .save()
    .rect(110, 130, 1, 80)
    .fill(medGrey)
    .restore()

    // Itemized Details
    .font(mainFont + '-Bold', 8)
    .fillColor(black)
    .text('Description', 50, 250)
    .text('Quantity', 370, 250)
    .text('Unit Price', 428, 250)
    .text('Amount', 485, 250, {
      align: 'right'
    })

    .save()
    // Line Separators
    .rect(360, 245, 1, 16)
    .rect(418, 245, 1, 16)
    .rect(475, 245, 1, 16)
    .fill(medGrey)
    .restore()
  ;

  let y = 260;

  tableDividerLine(doc, y);

  doc.font(mainFont, 8);

  invoice.items.forEach(function(item) {
    const marginTop = 10,
        marginBottom = 15,
        rowHeight = marginTop + marginBottom;

    doc.save()
      .rect(360, y, 1, rowHeight)
      .rect(418, y, 1, rowHeight)
      .rect(475, y, 1, rowHeight)
      .fill(medGrey)
      .restore();

    y += marginTop;

    const quantityStr =  '' + item.quantity,
        unitPriceStr = options.currencySymbol + ' ' + item.unit_price,
        amountStr = options.currencySymbol + ' ' + calcAmount(item);

    doc.font(mainFont, 8)
      .text(item.description, 50, y)
      .text(quantityStr, 370, y)
      .text(unitPriceStr, 428, y)
      .font(mainFont + '-Bold', 8)
      .text(amountStr, 485, y, {
        align: 'right'
      });

    y += marginBottom;
    tableDividerLine(doc, y);
  });

  y += 20;

  const amountDue = calcTotalAmount(invoice);
  const amountDueStr = options.currencySymbol + ' ' + amountDue;

  // Total Amount Due
  doc.font(mainFont + '-Bold', 14)
    .text('Amount Due', 340, y)
    .text(amountDueStr, 450, y, {
      align: 'right'
    })
  ;

  // Notes
  const notes = invoice.notes;
  if (notes && notes.length) {
    y += 40;

    doc.font(mainFont + '-Bold', 10)
      .text('Notes', 50, y);

    y += 15;

    tableDividerLine(doc, y);

    y += 15;

    doc.font(mainFont, 9)
      .text(notes, 50, y);
  }

  doc.end();

  return doc;
}

export default {
  createInvoice
};
