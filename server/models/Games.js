module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define("Games", {
        // username: {
        //     type: DataTypes.STRING,
        //     allowNULL: false,
        //     unique: true,
        //     validate: {
        //         notEmpty: true
        //     }
        // },
        given_word: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        guessed_word: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        game_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                isIn: [["AI", "Human"]],
            }
        }
    });
    return Game;
};