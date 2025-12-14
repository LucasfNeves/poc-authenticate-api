import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { faker } from '@faker-js/faker'

describe('InMemoryUsersRepository - Integration', () => {
  let repository: InMemoryUsersRepository

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
  })

  it('should create user and find by email', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      telephones: [{ number: 987654321, area_code: 11 }],
    }

    const createdUser = await repository.create(userData)
    const foundByEmail = await repository.findByEmail(userData.email)

    expect(foundByEmail).not.toBeNull()
    expect(foundByEmail?.id).toBe(createdUser.id)
    expect(foundByEmail?.email).toBe(userData.email)
  })

  it('should create user and find by id returning public data only', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      telephones: [{ number: 987654321, area_code: 11 }],
    }

    const createdUser = await repository.create(userData)
    const foundById = await repository.findById(createdUser.id)

    expect(foundById).not.toBeNull()
    expect(foundById?.id).toBe(createdUser.id)
    expect(foundById?.email).toBe(userData.email)
    expect(foundById).not.toHaveProperty('password')
  })

  it('should generate unique IDs for multiple users', async () => {
    const users = await Promise.all(
      Array.from({ length: 3 }, () =>
        repository.create({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          telephones: [{ number: 987654321, area_code: 11 }],
        })
      )
    )

    const ids = users.map((u) => u.id)
    expect(new Set(ids).size).toBe(3)
  })

  it('should find correct user among multiple users', async () => {
    const users = await Promise.all(
      Array.from({ length: 3 }, () =>
        repository.create({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          telephones: [{ number: 987654321, area_code: 11 }],
        })
      )
    )

    const foundUser = await repository.findByEmail(users[1].email)

    expect(foundUser).not.toBeNull()
    expect(foundUser?.id).toBe(users[1].id)
  })
})
