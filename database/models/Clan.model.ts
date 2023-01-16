import { Model, DataTypes, Optional } from 'sequelize';
import ClanMember from './ClanMember.model';
import { sequelize } from './index';
export interface ClanAttributes {
  id: number;
  tag: string;
  name: string;
  type: string;
  description: string;
  location: string;
  badgeUrls: string;
  clanLevel: number;
  clanPoints: number;
  clanVersusPoints: number;
  requiredTrophies: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  warTies: number;
  warLosses: number;
  isWarLogPublic: boolean;
  warLeague: string;
  memberCount: number;
  labels: string;
  requiredVersusTrophies: number;
  requiredTownhallLevel: number;
  clanCapital: string;
  chatLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ClanCreationAttributes extends Optional<ClanAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export default class Clan extends Model<ClanAttributes, ClanCreationAttributes> implements ClanAttributes {
  declare readonly id: ClanAttributes['id'];
  declare readonly tag: ClanAttributes['tag'];
  declare readonly name: ClanAttributes['name'];
  declare readonly type: ClanAttributes['type'];
  declare readonly description: ClanAttributes['description'];
  declare readonly location: ClanAttributes['location'];
  declare readonly badgeUrls: ClanAttributes['badgeUrls'];
  declare readonly clanLevel: ClanAttributes['clanLevel'];
  declare readonly clanPoints: ClanAttributes['clanPoints'];
  declare readonly clanVersusPoints: ClanAttributes['clanVersusPoints'];
  declare readonly requiredTrophies: ClanAttributes['requiredTrophies'];
  declare readonly warFrequency: ClanAttributes['warFrequency'];
  declare readonly warWinStreak: ClanAttributes['warWinStreak'];
  declare readonly warWins: ClanAttributes['warWins'];
  declare readonly warTies: ClanAttributes['warTies'];
  declare readonly warLosses: ClanAttributes['warLosses'];
  declare readonly isWarLogPublic: ClanAttributes['isWarLogPublic'];
  declare readonly warLeague: ClanAttributes['warLeague'];
  declare readonly memberCount: ClanAttributes['memberCount'];
  declare readonly labels: ClanAttributes['labels'];
  declare readonly requiredVersusTrophies: ClanAttributes['requiredVersusTrophies'];
  declare readonly requiredTownhallLevel: ClanAttributes['requiredTownhallLevel'];
  declare readonly clanCapital: ClanAttributes['clanCapital'];
  declare readonly chatLanguage: ClanAttributes['chatLanguage'];
  declare readonly createdAt: ClanAttributes['createdAt'];
  declare readonly updatedAt: ClanAttributes['updatedAt'];

  declare readonly members: ClanMember[];
}

Clan.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val: string) {
        this.setDataValue('location', JSON.stringify(val));
      },
      get() {
        return JSON.parse(this.getDataValue('location'));
      },
    },
    badgeUrls: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        this.setDataValue('badgeUrls', JSON.stringify(val));
      },
      get() {
        return JSON.parse(this.getDataValue('badgeUrls'));
      },
    },
    clanLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clanPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clanVersusPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requiredTrophies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warFrequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warWinStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warWins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warTies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warLosses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isWarLogPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    warLeague: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        this.setDataValue('warLeague', JSON.stringify(val));
      },
      get() {
        return JSON.parse(this.getDataValue('warLeague'));
      },
    },
    memberCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    labels: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        this.setDataValue('labels', JSON.stringify(val));
      },
      get() {
        return JSON.parse(this.getDataValue('labels'));
      },
    },
    requiredVersusTrophies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requiredTownhallLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clanCapital: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        this.setDataValue('clanCapital', JSON.stringify(val));
      },
      get() {
        return JSON.parse(this.getDataValue('clanCapital'));
      },
    },
    chatLanguage: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        this.setDataValue('chatLanguage', JSON.stringify(val));
      },
      get() {
        return JSON.parse(this.getDataValue('chatLanguage'));
      },
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
    tableName: 'clans',
    timestamps: true,
    sequelize,
  },
);

Clan.hasMany(ClanMember, { foreignKey: 'clanId', as: 'members' });
