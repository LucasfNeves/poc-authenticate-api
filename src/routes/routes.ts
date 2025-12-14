import { Router } from 'express'
import { routeAdapter } from '../infrastructure/http/adapters/route-adapter'
import { middlewareAdapter } from '../infrastructure/http/adapters/middleware-adapter'
import {
  makeRegisterUserController,
  makeAuthenticateUserController,
  makeGetUserByIdController,
} from '../infrastructure/factories'
import { makeAuthenticationMiddleware } from '../infrastructure/factories/middleware-factory'

export const router = Router()

router.post('/auth/register', routeAdapter(makeRegisterUserController()))
router.post('/auth/login', routeAdapter(makeAuthenticateUserController()))
router.get(
  '/user',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetUserByIdController())
)
