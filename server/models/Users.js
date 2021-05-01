const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstName: {
            tpye: DataTypes.STRING,
            allowNULL: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            tpye: DataTypes.STRING,
            allowNULL: false,
            validate: {
                notEmpty: true
            }
        },
    });
    return User;
};