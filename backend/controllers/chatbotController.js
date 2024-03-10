const { OpenAI } = require("openai")
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler")
const { sqlGenerator } = require("../models/sqlGenerator")
const { comparator } = require("../models/comparator")
const fs = require('fs');
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

    const content = JSON.stringify(req.body.content);

    //first, query database for an answer
    const sql_answer = async (content) => {
        try {
            const completion_sql = await sqlGenerator(content)
            return completion_sql.choices[0].message.content
        } catch (err) {
            res.status(400);
            throw new Error(`Error when calling sql generator api, ${err.message}`);
        }
    }

    //second, query openAI for a general answer
    const general_answer = async (content) => {
        try {
            const completion_general = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "based on your knowledge, answer the question" },
                    { role: "user", content: `${content}` }],
                model: "gpt-3.5-turbo",
            });
            return completion_general.choices[0].message.content
        } catch (err) {
            res.status(400);
            throw new Error(`Error when calling general api, ${err.message}`);
        }
    }


    //third, send to answers to comparator for choose
    try {
        console.log(sql_answer(content));
        console.log(general_answer(content));

        const completion = comparator(sql_answer, general_answer)
        const final_answer = completion.choices[0].message.content
        if (final_answer == "sql") {
            res.status(200)
            res.send(completion_sql.choices[0])
        } else {
            res.status(200)
            res.send(completion_general.choices[0])
        }
    } catch (err) {
        res.status(400);
        throw new Error(`Error when calling comparator api, ${err.message}`);
    }

})

module.exports = {
    chatBot,
}
