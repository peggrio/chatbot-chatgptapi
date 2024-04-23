const { OpenAI } = require("openai");
const dotenv = require("dotenv").config();
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const { spawn } = require('child_process');//execute the Python script
const { v4: uuidv4 } = require('uuid');

const systemRole = process.env.SYSTEM_ROLE;

const Rash_generator = asyncHandler(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400);
        throw new Error("Question is empty, please type in a question");
    }

    if (!req.body.content) {
        res.status(400);
        throw new Error("Content required");
    }

    const content = JSON.stringify(req.body.content);
    //generate a uuid as image name

    // Generate a UUID (v4 version)
    const uuid = uuidv4();
    const pythonProcess = spawn('python3', ['./models/rashImageGenerationModel.py', content, uuid]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Python process exited successfully');
            // Read the image file as a Buffer
            const buffer = fs.readFileSync(`./models/testimage/${uuid}.png`);
            // Convert the Buffer to a Base64-encoded string
            const base64String = buffer.toString('base64');
            // Send the Base64-encoded image data to the frontend
            res.status(200).send(base64String);
        } else {
            console.error(`Python process exited with code ${code}`);
        }
    });

});

module.exports = {
    Rash_generator,
};
