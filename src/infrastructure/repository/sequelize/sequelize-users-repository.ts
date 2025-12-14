import User from '../../database/models/User'
import {
  UsersRepository,
  UserCreationInput,
  UserPublicData,
} from '../interfaces'
import { TelephoneType } from '../../../shared/utils/types'

type UserJsonData = {
  id: string
  name: string
  email: string
  telephones: TelephoneType[]
  created_at: string
  updated_at: string
}

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
    const user = await User.findByPk(userId)

    if (!user) {
      return null
    }

    const { id, name, email, telephones, created_at, updated_at } =
      user.toJSON() as unknown as UserJsonData

    return {
      id,
      name,
      email,
      telephones,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }
}
