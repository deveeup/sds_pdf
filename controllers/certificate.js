const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { URLS } = require('../constants');

const { shortMonths } = require("../utils/index");

const getCertificate = async (req, res) => {
    const { query: {id, name, date} } = req;
    const { certificate } = URLS;
    const existingPdfBytes = await fetch(certificate).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const HelveticaOblique = await pdfDoc.embedFont(
      StandardFonts.HelveticaOblique
    );

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Certificate number
    firstPage.drawText(id, {
      x: width - 160,
      y: height - 87,
      size: 16,
      font: helveticaBold,
    });

    // Pet name
    const couple = name.length % 2 === 0;
    const letterSize = 20;

    const finishSize = letterSize + couple ? 10 : 0;
    const dynamicTitlePosition = ((name.length / 2) * letterSize) + finishSize;

    firstPage.drawText(name, {
      x: width - 430 - dynamicTitlePosition,
      y: height - 270,
      size: 34,
      font: helveticaBold,
    });

    // Register date
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    firstPage.drawText(`On this ${date} ${shortMonths[month]} ${year}`, {
      x: width - 230,
      y: 100,
      size: 13,
      font: HelveticaOblique,
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