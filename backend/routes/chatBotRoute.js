const express = require("express");
const router = express.Router();
const { chatBot } = require("../controllers/chatbotController")

router.post("/", chatBot);

module.exports = router;