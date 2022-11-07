import { Router } from 'express'
import { makeSignUp } from '../factories/signup'
import { routeAdapter } from './adapters/route-adapter'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUp()))
}
