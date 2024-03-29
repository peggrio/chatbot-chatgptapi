const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();
const { QueryTypes } = require('sequelize');
const asyncHandler = require("express-async-handler");
const db = require('../config/sequelize');
const fs = require('fs')


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const comparator = asyncHandler(async (content, sql_answer, general_answer) => {
    console.log("sql_answer:", sql_answer);
    console.log("general_answer:", general_answer);
    if (sql_answer.length == 0) {
        return "no"
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "user", content: "The question is:" + `${content}` + ", after query in our database, the potential response is:" + `${sql_answer}` + ", do you think the response can answer the question with detailed information? Only return 'yes' or 'no'" }
            ],
            model: "gpt-3.5-turbo",
        });
        console.log('====================================');
        console.log(completion.choices[0].message.content.toLowerCase());
        console.log('====================================');
        return completion.choices[0].message.content.toLowerCase();

    } catch (err) {
        throw new Error(`Error when calling comparator api, ${err.message}`);
    }
})

module.exports = {
    comparator,
}