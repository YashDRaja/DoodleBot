module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define("Games", {
        game_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                isIn: [["AI", "Human"]],
            }
        },
        score: {
            type: DataTypes.STRING
        }
    });
    Game.associate = (models) => {
        Game.hasMany(models.Rounds, {
            onDelete: "cascade",
            foreignKey: 'game_id'
        });
    }
    return Game;
};