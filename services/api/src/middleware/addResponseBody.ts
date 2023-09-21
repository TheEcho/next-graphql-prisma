import type { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Result Data is not available in Response object
 * Add it in res.data in order to access it where needed in other middlewares
 */
export const addResponseToBody: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.send = (fn => data => {
    res.body = data

    return fn.call(res, data)
  })(res.send)
  res.json = (fn => data => {
    res.body = data

    return fn.call(res, data)
  })(res.json)

  next()
}
