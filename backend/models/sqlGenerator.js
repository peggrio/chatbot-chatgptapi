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

        //based on the records and input content, call API again, generate the answer and return

        const completion_2 = await openai.chat.completions.create({
            messages: [
                {
                    role: "system", content: `You are a travel agent, this is the answer you have for the question: ${JSON.stringify(records)} , reply the question with this answer, start with "After query from our database", keep it simple`
                },
                { role: "user", content: `${content}` }],
            model: "gpt-3.5-turbo",
        })
        const ans = completion_2.choices[0].message.content
        console.log("ans: ", ans);
        return completion_2

    } catch (error) {
        throw new Error(`Error when query from database, ${error.message}`);
    }
})

module.exports = {
    sqlGenerator,
}