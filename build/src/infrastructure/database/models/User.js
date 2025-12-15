import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
class User extends Model {
}
User.init({
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
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
});
export default User;
