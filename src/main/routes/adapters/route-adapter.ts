import { Request, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export const routeAdapter = (controller: Controller): any => {
  return async (req: Request, res: Response): Promise<any> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
