//this file define the schema of travel package

module.exports = (sequelize, DataTypes) => {

    const Plan = sequelize.define("plans", {
        depart: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stops: {
            type: DataTypes.STRING,
            allowNull: false,
            default: "Non-stop",
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        airline: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        season: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
    )
    return Plan
}