const express = require("express");
const router = express.Router();
const { Rash_generator } = require("../controllers/rashController");

router.post("/", chatBot);

module.exports = router;