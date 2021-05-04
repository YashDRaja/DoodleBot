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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: {
                msg: "Must be a valid email address",
              }
            }
        }
    });
    User.associate = (models) => {
        User.hasMany(models.Games, {
            onDelete: "cascade",
            foreignKey: 'user_id'
        });
    }
    return User;
};