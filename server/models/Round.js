module.exports = (sequelize, DataTypes) => {
  const Round = sequelize.define("Rounds", {
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
      round_num: {
          type: DataTypes.STRING
      }
  });
  return Round;
};