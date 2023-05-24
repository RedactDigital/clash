module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('clans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      badgeUrls: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      clanLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clanPoints: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clanVersusPoints: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      requiredTrophies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      warFrequency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      warWinStreak: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      warWins: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      warTies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      warLosses: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isWarLogPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      warLeague: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      members: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      labels: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      requiredVersusTrophies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      requiredTownhallLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clanCapital: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      chatLanguage: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('clans');
  },
};
