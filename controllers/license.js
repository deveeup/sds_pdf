const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { URLS } = require("../constants");

const getLicense = async (req, res) => {
  // example: http://localhost:3000/license?name=polito&id=SA-1234&breed=MixedBreed&dob=05/05/2024&date=21/08/2020&owner=DavidCamacho&microchip=98342342894234432&city=Miami,FL
  const {
    query: { name, id, breed, dob, date, owner, microchip, city },
  } = req;
  const { license } = URLS;
  const existingPdfBytes = await fetch(license).then((res) =>
    res.arrayBuffer()
  );

  // Fetch JPEG image
  const jpgUrl =
    "https://firebasestorage.googleapis.com/v0/b/servicedogschool-e0fc7.appspot.com/o/SA-2809168-I.png?alt=media&token=4e8bf029-958c-4a13-9316-f72845e5da35";
  const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const HelveticaOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique
  );

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // Name
  firstPage.drawText(String(name).toUpperCase(), {
    x: width - 138,
    y: height - 52,
    size: 16,
    font: helveticaBold,
  });

  // Certificate number
  firstPage.drawText(id, {
    x: width - 87,
    y: height - 62,
    size: 8,
    font: helvetica,
  });

  // Breed
  firstPage.drawText(breed, {
    x: width - 113,
    y: height - 74,
    size: 8,
    font: helvetica,
  });

  // DOB
  firstPage.drawText(dob, {
    x: width - 118,
    y: height - 86,
    size: 8,
    font: helvetica,
  });

  // Registered date
  firstPage.drawText(date, {
    x: width - 76,
    y: height - 98,
    size: 8,
    font: helvetica,
  });

  // Owner
  firstPage.drawText(owner, {
    x: width - 111,
    y: height - 110,
    size: 8,
    font: helvetica,
  });

  // Microchip
  firstPage.drawText(microchip, {
    x: width - 94,
    y: height - 122,
    size: 8,
    font: helvetica,
  });

  // City
  firstPage.drawText(city, {
    x: width - 137,
    y: height - 134,
    size: 6,
    font: HelveticaOblique,
  });

  // Draw image
  const jpgImage = await pdfDoc.embedPng(jpgImageBytes);
  const jpgDims = jpgImage.scale(0.18);

  firstPage.drawImage(jpgImage, {
    x: 16,
    y: 202,
    width: jpgDims.width,
    height: jpgDims.height,
  });

  const pdfBytes = await pdfDoc.save();

  const fileData = pdfBytes;
  const fileName = `${id}-L.pdf`;
  const fileType = "application/pdf";

  res.writeHead(200, {
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "Content-Type": fileType,
  });

  const download = Buffer.from(fileData, "base64");
  res.end(download);
};

module.exports = { getLicense };
