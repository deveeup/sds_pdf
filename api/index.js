const express = require('express');
const app = express.Router();
const { getCertificate } = require("../controllers/certificate.js");

app.get('/certificate', getCertificate);

module.exports = app;
