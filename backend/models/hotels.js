//this file define the schema of travel package

module.exports = (sequelize, DataTypes) => {

    const Hotel = sequelize.define("hotels", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        review: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        special: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
    )
    return Hotel
}