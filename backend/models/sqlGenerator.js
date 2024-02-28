const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();
const { QueryTypes } = require('sequelize');
const asyncHandler = require("express-async-handler");
const db = require('../config/sequelize');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const sqlGenerator = asyncHandler(async (content) => {
    const systemSQLRole = process.env.SYSTEM_SQL_ROLE
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system", content: `${systemSQLRole}`
            },
            { role: "user", content: `${content}` }],
        model: "gpt-3.5-turbo",
    })

    const query = completion.choices[0].message.content
    console.log("query is here!", query);
    try {
        const records = await db.sequelize.query(query.toString(), { type: QueryTypes.SELECT });

        console.log("records:", records);
    } catch (error) {
        throw new Error(`Error when query from database, ${error.message}`);
    }
})

module.exports = {
    sqlGenerator,
}