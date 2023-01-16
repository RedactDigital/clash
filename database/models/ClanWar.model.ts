import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';

export interface ClanWarAttributes {
  id: number;
  clanId: number;
  state: string;
  teamSize: number;
  destructionPercentage: string;
  preparationStartTime: Date;
  stars: number;
  attacks: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ClanWarCreationAttributes extends Optional<ClanWarAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export default class ClanWar extends Model<ClanWarAttributes, ClanWarCreationAttributes> implements ClanWarAttributes {
  declare readonly id: ClanWarAttributes['id'];
  declare readonly clanId: ClanWarAttributes['clanId'];
  declare readonly state: ClanWarAttributes['state'];
  declare readonly teamSize: ClanWarAttributes['teamSize'];
  declare readonly destructionPercentage: ClanWarAttributes['destructionPercentage'];
  declare readonly preparationStartTime: ClanWarAttributes['preparationStartTime'];
  declare readonly stars: ClanWarAttributes['stars'];
  declare readonly attacks: ClanWarAttributes['attacks'];
  declare readonly startTime: ClanWarAttributes['startTime'];
  declare readonly endTime: ClanWarAttributes['endTime'];
  declare readonly createdAt: ClanWarAttributes['createdAt'];
  declare readonly updatedAt: ClanWarAttributes['updatedAt'];
}

ClanWar.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'clans',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    destructionPercentage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preparationStartTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attacks: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'clanWars',
    timestamps: true,
    sequelize,
  },
);
