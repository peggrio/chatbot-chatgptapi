//this file define the schema of travel package

const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
    depart: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    stops: {
        type: String,
        required: true,
        default: "Non-stop",
        trim: true
    },
    cost: {
        type: String,
        required: true
    },
    airline: {
        type: String,
        required: true,
        trim: true
    },
    season: {
        type: String,
        required: true,
        trim: true
    }
})

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;