const express = require('express');
const app = express.Router();
const { getCertificate } = require("../controllers/certificate.js");
const { getLicense } = require("../controllers/license.js");

app.get('/certificate', getCertificate);
app.get("/license", getLicense);

module.exports = app;
