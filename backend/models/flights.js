//this file define the schema of travel package

module.exports = (sequelize, DataTypes) => {

    const Flight = sequelize.define("flights", {
        airline: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_journey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false,
            default: "Non-stop",
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dep_time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrival_time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_stops: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        additional_info: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }
    )
    return Flight
}