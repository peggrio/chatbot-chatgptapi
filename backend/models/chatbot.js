const { OpenAI } = require("openai")
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler")
const { sqlGenerator } = require("../models/sqlGenerator")
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

    //first, train chatGPT to make it distinguish whether it is a sql related question
    //reply 'yes' or 'no'
    const fs = require('fs');

    // Define a function to read the file and parse the JSON data
    const readSampleMessages = async () => {
        try {

            const data = await fs.promises.readFile('./trainData/sampleMessages.json', 'utf8');
            const sampleMessages = JSON.parse(data);

            return sampleMessages.map(sampleMessage => {
                return {
                    "message": sampleMessage.message,
                    "isSQLconvertible": sampleMessage.sql
                };
            });
        } catch (err) {
            console.error('Error reading file:', err);
            throw err;
        }
    };

    try {
        const prompt = await readSampleMessages();

        const content = JSON.stringify(req.body.content);
        // Call OpenAI API to generate response
        console.log("prompt:", prompt);
        const completion = await openai.chat.completions.create({
            //Remember, only query sql is allowed, update, create or delete sql are not allowed, they should go to "no".\n
            messages: [
                {
                    role: "system", content: `you are a travel agent, your job is to distinguish whether a coming message\n
              represents a general question or can convert to a sql to query our own database.\n
              If yes, means the question could be convert to a sql, then reply with "yes", otherwise reply with "no".\n
              Here are some examples: \n
              ${prompt}`
                },
                { role: "user", content: `${content}` }],
            model: "gpt-3.5-turbo",
        });

        const ans = completion.choices[0].message.content
        if (ans == "no") {
            try {
                console.log("no!");
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: `${systemRole}` },
                        { role: "user", content: `${content}` }],
                    model: "gpt-3.5-turbo",
                });
                res.status(200)
                res.send(completion.choices[0])
            } catch (err) {
                res.status(400);
                throw new Error(`Error when calling general api, ${err.message}`);
            }
        } else {
            console.log("yes!");
            try {
                //call sql generator
                chatboxColor = "yellow"
                const completion = sqlGenerator(content, chatboxColor)
                res.status(200)
                res.send(completion.choices[0])
            } catch (err) {
                res.status(400);
                throw new Error(`Error when calling sql generator api, ${err.message}`);
            }
        }

    } catch (err) {
        res.status(400);
        throw new Error(`Error when calling api, ${err.message}`);
    }
})

module.exports = {
    chatBot,
}
