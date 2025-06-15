const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const requireLogin = require("../middlewares/requireLogin");

router.get("/stats", requireLogin, dashboardController.getStats);

module.exports = router;
