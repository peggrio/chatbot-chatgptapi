const chatBotRoute = require("./routes/chatBotRoute")
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middleWare/errorMiddleware")

const app = express();

const PORT = process.env.PORT || 5003;

//Connect to DB and start server

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}).catch((err) => console.log(err))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

//remember when deploy to other domain, add more domains here!!!
app.use(cors({
    origin: ["http://localhost:3000",],
    credentials: true
}));

// Route middleware
app.use("/chatbot", chatBotRoute);

// Error middleware
app.use(errorHandler);


//Routes
app.get("/", (req, res) => {
    res.send("Home Page");
})

