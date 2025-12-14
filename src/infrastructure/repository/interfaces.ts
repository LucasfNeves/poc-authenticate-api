import { CreationAttributes, Attributes } from 'sequelize'
import User from '../database/models/User'

export type UserCreationInput = CreationAttributes<User>
export type UserAttributes = Attributes<User>

export type UserPublicData = Pick<UserAttributes, 'id' | 'name' | 'email'>

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: UserCreationInput): Promise<User>
  findById(userId: string): Promise<UserPublicData | null>
}
