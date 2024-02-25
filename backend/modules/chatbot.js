const { OpenAI } = require("openai")
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemRole = process.env.SYSTEM_ROLE

const chatBot = asyncHandler(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400);
        throw new Error("Question is empty, please type in a question")
    }

    if (!req.body.content) {
        res.status(400);
        throw new Error("Content required")
    }

    try {
        const content = JSON.stringify(req.body.content);
        // Call OpenAI API to generate response
        const completion = await openai.chat.completions.create({
            //messages: [{ role: "system", content: `${content}` }],//
            messages: [
                { role: "system", content: `${systemRole}` },
                { role: "user", content: `${content}` }],
            model: "gpt-3.5-turbo",
        });
        res.status(200)
        res.send(completion.choices[0])
    } catch (err) {
        res.status(400);
        throw new Error(`Error when calling api, ${err.message}`);
    }
})

module.exports = {
    chatBot,
}
