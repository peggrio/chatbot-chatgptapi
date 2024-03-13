const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler");
const fs = require('fs')


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const comparator_2 = asyncHandler(async (contents) => {
    //first, train chatGPT to make it distinguish whether it is a sql related question
    //reply 'yes' or 'no'


    // Define a function to read the file and parse the JSON data
    const readSampleMessages = async () => {
        try {

            const data = await fs.promises.readFile('./data/sampleMessages.json', 'utf8');
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

        const content = JSON.stringify(contents);
        // Call OpenAI API to generate response
        // console.log("prompt:", prompt);
        const completion = await openai.chat.completions.create({
            //Remember, only query sql is allowed, update, create or delete sql are not allowed, they should go to "no".\n
            messages: [
                {
                    role: "system", content: `you are a travel agent, your job is to distinguish whether a coming message\n
              represents a general question or can convert to a sql to query our own database.\n
              If yes, means the question could be convert to a sql, then only reply with "sql", otherwise, only reply with "general".\n
              Here are some examples: \n
              ${prompt}`
                },
                { role: "user", content: `${content}` }],
            model: "gpt-3.5-turbo",
        });
        console.log('====================================');
        console.log("haha", completion.choices[0].message.content);
        console.log('====================================');
        return completion.choices[0].message.content

    } catch (err) {
        throw new Error(`Error when reading database schema, ${err.message}`);
    }
})

module.exports = {
    comparator_2,
}

