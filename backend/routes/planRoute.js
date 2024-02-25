const express = require("express");
const router = express.Router();
const { plan } = require("../controllers/planController")

router.post("/register", plan);

module.exports = router;