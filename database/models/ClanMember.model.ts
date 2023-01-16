import { Model, DataTypes, Optional } from 'sequelize';
import Clan from './Clan.model';
import ClanMemberWarAttack from './ClanMemberWarAttack.model';
import { sequelize } from './index';

export interface ClanMemberAttributes {
  id: number;
  clanId: number;
  tag: string;
  name: string;
  role: 'Member' | 'Elder' | 'Co-Leader' | 'Leader' | 'Former Member';
  notes: string;
  expLevel: number;
  league: string;
  trophies: number;
  versusTrophies: number;
  donations: number;
  donationsReceived: number;
  donationsRatio: string;
  warPreference: string;
  averageAttacks: number;
  totalAttacks: number;
  totalWars: number;
  totalStars: number;
  averageStars: number;
  averageDestruction: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ClanMemberCreationAttributes extends Optional<ClanMemberAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export default class ClanMember extends Model<ClanMemberAttributes, ClanMemberCreationAttributes> implements ClanMemberAttributes {
  declare readonly id: ClanMemberAttributes['id'];
  declare readonly clanId: ClanMemberAttributes['clanId'];
  declare readonly tag: ClanMemberAttributes['tag'];
  declare readonly name: ClanMemberAttributes['name'];
  declare readonly role: ClanMemberAttributes['role'];
  declare readonly notes: ClanMemberAttributes['notes'];
  declare readonly expLevel: ClanMemberAttributes['expLevel'];
  declare readonly league: ClanMemberAttributes['league'];
  declare readonly trophies: ClanMemberAttributes['trophies'];
  declare readonly versusTrophies: ClanMemberAttributes['versusTrophies'];
  declare readonly donations: ClanMemberAttributes['donations'];
  declare readonly donationsReceived: ClanMemberAttributes['donationsReceived'];
  declare readonly donationsRatio: ClanMemberAttributes['donationsRatio'];
  declare readonly warPreference: ClanMemberAttributes['warPreference'];
  declare readonly averageAttacks: ClanMemberAttributes['averageAttacks'];
  declare readonly totalAttacks: ClanMemberAttributes['totalAttacks'];
  declare readonly totalWars: ClanMemberAttributes['totalWars'];
  declare readonly totalStars: ClanMemberAttributes['totalStars'];
  declare readonly averageStars: ClanMemberAttributes['averageStars'];
  declare readonly averageDestruction: ClanMemberAttributes['averageDestruction'];
  declare readonly score: ClanMemberAttributes['score'];
  declare readonly createdAt: ClanMemberAttributes['createdAt'];
  declare readonly updatedAt: ClanMemberAttributes['updatedAt'];

  declare readonly warAttacks: ClanMemberWarAttack[];
}

ClanMember.init(
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
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league: {
      type: DataTypes.TEXT,
      set: function (val) {
        this.setDataValue('league', JSON.stringify(val));
      },
      get: function () {
        return JSON.parse(this.getDataValue('league'));
      },
    },
    trophies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    versusTrophies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donations: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donationsReceived: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    donationsRatio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warPreference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averageAttacks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalAttacks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalWars: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalStars: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageStars: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageDestruction: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
    tableName: 'members',
    timestamps: true,
    sequelize,
  },
);

ClanMember.hasMany(ClanMemberWarAttack, { foreignKey: 'memberId', as: 'warAttacks' });
