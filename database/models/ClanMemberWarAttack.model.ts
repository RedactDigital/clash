import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';

export interface ClanMemberWarAttackAttributes {
  id: number;
  memberId: number;
  clanWarId: number;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  duration: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ClanMemberWarAttackCreationAttributes extends Optional<ClanMemberWarAttackAttributes, 'id' | 'defenderTag' | 'createdAt' | 'updatedAt'> {}

export default class ClanMemberWarAttack
  extends Model<ClanMemberWarAttackAttributes, ClanMemberWarAttackCreationAttributes>
  implements ClanMemberWarAttackAttributes
{
  declare readonly id: ClanMemberWarAttackAttributes['id'];
  declare readonly memberId: ClanMemberWarAttackAttributes['memberId'];
  declare readonly clanWarId: ClanMemberWarAttackAttributes['clanWarId'];
  declare readonly defenderTag: ClanMemberWarAttackAttributes['defenderTag'];
  declare readonly stars: ClanMemberWarAttackAttributes['stars'];
  declare readonly destructionPercentage: ClanMemberWarAttackAttributes['destructionPercentage'];
  declare readonly duration: ClanMemberWarAttackAttributes['duration'];
  declare readonly order: ClanMemberWarAttackAttributes['order'];
  declare readonly createdAt: ClanMemberWarAttackAttributes['createdAt'];
  declare readonly updatedAt: ClanMemberWarAttackAttributes['updatedAt'];
}

ClanMemberWarAttack.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    memberId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    clanWarId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'clanWars',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    defenderTag: {
      type: DataTypes.STRING,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    destructionPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'memberWarAttacks',
    timestamps: true,
    sequelize,
  },
);
