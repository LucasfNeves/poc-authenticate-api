import { Router } from 'express'
import { routeAdapter } from '../infrastructure/http/adapters/route-adapter'
import {
  makeRegisterUserController,
  makeAuthenticateUserController,
} from '../infrastructure/factories'

export const router = Router()

router.post('/auth/register', routeAdapter(makeRegisterUserController()))
router.post('/auth/login', routeAdapter(makeAuthenticateUserController()))
