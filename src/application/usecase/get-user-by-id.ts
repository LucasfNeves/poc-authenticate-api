import { UserNotFoundError } from '../../shared/utils/errors'
import { UsersRepository } from '../../infrastructure/repository/interfaces'
import { TelephoneType } from '../../shared/utils/types'

interface GetUserByIdUseCaseResponse {
  user: {
    id: string
    email: string
    telephones: TelephoneType[]
    created_at: string | undefined
    modified_at: string | undefined
  }
}

export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<GetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        telephones: user.telephones || [],
        created_at: user.createdAt,
        modified_at: user.updatedAt,
      },
    }
  }
}