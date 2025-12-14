import User from '../../database/models/User'
import {
  UsersRepository,
  UserCreationInput,
  UserPublicData,
} from '../interfaces'

export class SequelizeUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email },
    })
    return user
  }

  async create(data: UserCreationInput): Promise<User> {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      telephones: data.telephones || [],
    })
    return user
  }

  async findById(userId: string): Promise<UserPublicData | null> {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}
