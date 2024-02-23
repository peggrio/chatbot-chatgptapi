const express = require("express");
const router = express.Router();
const { chatBot } = require("../modules/chatbot")

router.post("/", chatBot);

module.exports = router;