const express = require("express");
const router = express.Router();
const contenuController = require("../controllers/contenuController");

//router.get("/details", contenuController.getAllContenus);
router.get("/details", contenuController.getContenus);

module.exports = router;
