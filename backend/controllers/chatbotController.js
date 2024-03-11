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
            if (completion_sql.length == 0) return ""
            return completion_sql
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
            return completion_general
        } catch (err) {
            res.status(400);
            throw new Error(`Error when calling general api, ${err.message}`);
        }
    }

    //Third, send to answers to comparator for choose

    //call sql_answer twice to improve the accuracy
    const callTwice = async (content) => {
        let ans = await sql_answer(content);
        if (ans.length == 0) {
            ans = await sql_answer(content);
        }
        return ans;
    }

    try {
        const sql_result = await callTwice(content)
        const general_result = await general_answer(content)

        const sql_answer_string = sql_result.length == 0 ? "" : sql_result.choices[0].message.content;
        const general_answer_string = general_result.choices[0].message.content;

        const decision = await comparator(content, sql_answer_string, general_answer_string)

        if (decision == "yes") {
            res.status(200)
            console.log('====================================');
            console.log("sql!!");
            console.log('====================================');
            res.send(sql_result.choices[0])
        } else {
            res.status(200)
            console.log('====================================');
            console.log("general!!");
            console.log('====================================');
            res.send(general_result.choices[0])
        }
    } catch (err) {
        res.status(400);
        throw new Error(`Error when calling comparator api, ${err.message}`);
    }

})

module.exports = {
    chatBot,
}
