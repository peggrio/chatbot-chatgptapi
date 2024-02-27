const asyncHandler = require("express-async-handler")
const db = require('../config/sequelize')
const seasons = ["spring", "summer", "fall", "winter"];

const Plan = db.plans

const checkSeasons = (season) => {
    season = season.toLowerCase();
    if (seasons.includes(season)) {
        return true
    } else {
        return false
    }
}

const plan = asyncHandler(async (req, res) => {
    const { depart, destination, stops, cost, airline, season } = req.body
    //validation
    if (!depart || !destination || !stops || !cost || !airline || !season) {
        res.status(400)
        throw new Error("please fill in all required fields")
    }

    if (!checkSeasons(season)) {
        res.status(400)
        throw new Error("please input correct season")
    }

    //check if the plan already exists
    const planExist = await Plan.findOne({
        where: {
            depart: depart,
            destination: destination,
            stops: stops,
            airline: airline,
            season: season
        }
    })

    if (planExist) {
        res.status(400)
        throw new Error("this package already exist")
    }

    //create new Plan
    const plan = await Plan.create({
        depart,
        destination,
        stops,
        cost,
        airline,
        season
    });

    if (plan) {
        const { _id, depart, destination, stops, cost, airline, season } = plan
        res.status(201).json({
            _id, depart, destination, stops, cost, airline, season
        })
    } else {
        res.status(400)
        throw new Error("invalid plan data")
    }
});

module.exports = {
    plan
}