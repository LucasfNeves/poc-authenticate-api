import { randomUUID } from 'crypto'
import User from '../../database/models/User'
import {
  UsersRepository,
  UserCreationInput,
  UserPublicData,
} from '../interfaces'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)
    return user || null
  }

  async create(data: UserCreationInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      telephones: data.telephones || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User

    this.items.push(user)
    return user
  }

  async findById(userId: string): Promise<UserPublicData | null> {
    const user = this.items.find((user) => user.id === userId)

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
