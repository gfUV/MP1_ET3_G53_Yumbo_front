const express = require("express");
const router = express.Router();
const SessionController = require("../controllers/SessionController");

// Endpoint de login
router.post("/login", (req, res) => SessionController.login(req, res));

module.exports = router;
