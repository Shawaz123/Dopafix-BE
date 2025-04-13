const express = require("express");
const router = express.Router();
const { analyzeImage } = require("../Controllers/detectionController");

router.post("/detect", analyzeImage);

module.exports = router;
