const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const requireLogin = require("../middlewares/requireLogin");

router.get('/shortage',requireLogin, alertController.checkalert)


module.exports = router;