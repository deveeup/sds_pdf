const express = require('express');
const router = express.Router();
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ key: "value" });
});

router.get("/certificate", async function (req, res, next) {
  const url =
    "https://firebasestorage.googleapis.com/v0/b/servicedogschool-e0fc7.appspot.com/o/SA-2809131-C.pdf?alt=media&token=a314d2a9-a263-45c4-9b8a-9f5f933cdae7";

  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

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

});

module.exports = router;
