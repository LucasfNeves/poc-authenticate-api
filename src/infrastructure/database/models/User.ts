import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

interface TelephoneData {
  number: number
  area_code: number
}

interface UserAttributes {
  id: string
  name: string
  email: string
  password: string
  telephones: TelephoneData[]
  createdAt?: Date
  updatedAt?: Date
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string
  declare name: string
  declare email: string
  declare password: string
  declare telephones: TelephoneData[]
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telephones: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
)

export default User
