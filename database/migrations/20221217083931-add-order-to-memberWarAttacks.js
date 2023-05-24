module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('memberWarAttacks', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'duration',
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('memberWarAttacks', 'order');
  },
};
