'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * 
     */
     await queryInterface.addColumn("Users", "first_name", {
      type: Sequelize.DataTypes.STRING,
      defaultValue: '1',
      allowNull: false,
      validate: {
        notEmpty: true
      },
  });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * ;
     */
     await queryInterface.removeColumn('Users', "first_name");
  }
};
