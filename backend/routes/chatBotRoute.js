const express = require("express");
const router = express.Router();
const { chatBot } = require("../models/chatbot")

router.post("/", chatBot);

module.exports = router;