import { Request, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

export const routeAdapter = (controller: Controller): any => {
  return async (req: Request, res: Response): Promise<any> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      return res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
