const express = require('express');
const controller = require('../controllers/server-tcp_experience.controller');
const router = express.Router();

router.post("/add", controller.createExperience);

module.exports = router;