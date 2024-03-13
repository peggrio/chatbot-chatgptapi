const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();
const { QueryTypes } = require('sequelize');
const asyncHandler = require("express-async-handler");
const db = require('../config/sequelize');
const fs = require('fs')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const sqlGenerator = asyncHandler(async (content) => {

    try {
        const schema = await fs.promises.readFile('./data/table_schema.txt', 'utf8');
        const systemSchemaQuery = schema;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system", content: `${systemSchemaQuery.toString()}`
                },
                { role: "user", content: "Based on the question:" + `${content}` + ", write a SQL query, return the SQL only, do not include explanations. " }],
            model: "gpt-3.5-turbo",
        });

        const query = completion.choices[0].message.content;

        try {
            const records = await db.sequelize.query(query.toString(), { type: QueryTypes.SELECT });
            //console.log("records:", JSON.stringify(records));
            if (records.length == 0) {
                console.log("hey! empty");
                return ""
            }
            //limit the return answers in 2
            let manyRecord
            if (records.length > 3) {
                manyRecord = JSON.stringify(records[1]) + JSON.stringify(records[2]) + JSON.stringify(records[3]);
                console.log('====================================');
                console.log("manyRecord:", JSON.stringify(manyRecord));
                console.log('====================================');
            }

            const recordTooManyTag = records.length > 3 ? true : false;

            //based on the records and input content, call API again, generate the answer and return

            let completion_2
            if (recordTooManyTag) {
                completion_2 = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system", content: `You are a travel agent, this are the answers you have for the question: ${JSON.stringify(manyRecord)} , reply the question with this answer(you should include all the answer), start with "After query from our database, we pick some options for you: ", keep it simple`
                        },
                        { role: "user", content: `${content}` }],
                    model: "gpt-3.5-turbo",
                })
            } else {
                completion_2 = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system", content: `You are a travel agent, this is the answer you have for the question: ${JSON.stringify(records)} , reply the question with this answer, start with "After query from our database", keep it simple`
                        },
                        { role: "user", content: `${content}` }],
                    model: "gpt-3.5-turbo",
                })
            }

            const ans = completion_2.choices[0].message.content
            console.log("ans: ", ans);
            return completion_2

        } catch (error) {
            //based on the query, an error happened, means we need put it to general question
            return "";
        }

    } catch (err) {
        throw new Error(`Error when reading database schema, ${err.message}`);
    }
})

module.exports = {
    sqlGenerator,
}