module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNULL: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNULL: false,
            validate: {
                notEmpty: true
            }
        },
    });
    return User;
};