module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      clanId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'clans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      league: {
        type: Sequelize.TEXT,
        set(val) {
          this.setDataValue('league', JSON.stringify(val));
        },
        get() {
          return JSON.parse(this.getDataValue('league'));
        },
      },
      trophies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      versusTrophies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      donations: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      donationsReceived: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      donationsRatio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      warPreference: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      averageAttacks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalAttacks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalWars: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalStars: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      averageStars: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      averageDestruction: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      score: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
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
    await queryInterface.dropTable('members');
  },
};
