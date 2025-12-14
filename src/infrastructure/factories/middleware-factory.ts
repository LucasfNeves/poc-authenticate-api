import { AuthenticationMiddleware } from '../../application/middlewares/AuthenticationMiddleware'

export const makeAuthenticationMiddleware = () => {
  return new AuthenticationMiddleware()
}