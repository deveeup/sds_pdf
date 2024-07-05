const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { URLS } = require('../constants')

const getCertificate = async (req, res) => {
    const { certificate } = URLS;
    const existingPdfBytes = await fetch(certificate).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawText("This text was added with JavaScript!", {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
    });

    const pdfBytes = await pdfDoc.save();

    const fileData = pdfBytes;
    const fileName = "hello_world.pdf";
    const fileType = "application/pdf";

    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": fileType,
    });

    const download = Buffer.from(fileData, "base64");
    res.end(download);
  }

module.exports = { getCertificate };