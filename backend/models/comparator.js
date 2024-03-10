const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();
const { QueryTypes } = require('sequelize');
const asyncHandler = require("express-async-handler");
const db = require('../config/sequelize');
const fs = require('fs')


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const comparator = asyncHandler(async (sql_answer, general_answer) => {
    console.log("content:", content);
    try {
        const schema = await fs.promises.readFile('./data/table_schema.txt', 'utf8');
        const systemSchemaQuery = schema;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system", content: `${systemSchemaQuery.toString()}`
                },
                { role: "user", content: "Write a SQL query which computes the average total order value for all orders on 2023-04-01." }],
            model: "gpt-3.5-turbo",
        });

        const query = completion.choices[0].message.content;
        console.log("query is here!", query);
    } catch (err) {
        throw new Error(`Error when reading database schema, ${err.message}`);
    }





    fs.writeFile('./data/table_schema.txt', (err, schema) => {
        if (err) {
            res.status(400);
            throw new Error(`Error when reading database schema, ${err.message}`);
        } else {
            const systemSchemaQuery = schema;

            const completion = openai.chat.completions.create({
                messages: [
                    {
                        role: "system", content: `${systemSchemaQuery.toString()}`
                    },
                    { role: "user", content: "Write a SQL query which computes the average total order value for all orders on 2023-04-01." }],
                model: "gpt-3.5-turbo",
            })

            const query = completion.choices[0].message.content
            console.log("query is here!", query);

        }
    })

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system", content: `${systemSchemaQuery.toString()}`
            },
            { role: "user", content: "Write a SQL query which computes the average total order value for all orders on 2023-04-01." }],
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
    comparator,
}