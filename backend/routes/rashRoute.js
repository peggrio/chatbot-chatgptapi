const express = require("express");
const router = express.Router();
const { Rash_generator } = require("../controllers/rashController");

router.post("/", Rash_generator);

module.exports = router;