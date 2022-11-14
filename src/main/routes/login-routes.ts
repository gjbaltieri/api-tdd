import { Router } from 'express'
import { makeLoginController } from '../factories/login/login-factory'
import { makeSignUp } from '../factories/signup/signup'
import { routeAdapter } from './adapters/route-adapter'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUp()))
  router.post('/login', routeAdapter(makeLoginController()))
}
