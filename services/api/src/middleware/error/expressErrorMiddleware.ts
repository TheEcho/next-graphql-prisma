import type { NextFunction, Request, Response } from 'express'

import Boom from '@hapi/boom'
import { isProdEnvironment } from 'utils/env'

import { redactError } from './formatError'

export const expressErrorMiddleware = (
  err: (Error & { output?: { statusCode?: number } }) | Boom.Boom,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // In case the logger middleware has not been called yet
  // eslint-disable-next-line no-console
  const logError = req.log ? req.log.error : console.error

  if (!Boom.isBoom(err)) {
    const statusCode = err?.output?.statusCode || 500

    logError({ stack: err.stack, msg: err.message })
    res.status(statusCode).json({ error: err }).send()

    return
  }

  const boomError = err as Boom.Boom

  const { safeErrorData, sensitiveData } = redactError({ request: req }, boomError)

  const { errorMessage, errorCode, statusCode, data } =
    isProdEnvironment() && req.auth.isUserAccountLogged() ? safeErrorData : sensitiveData

  logError({ stack: err.stack, msg: err.message })
  res.status(statusCode).json({ errorMessage, errorCode, statusCode, data }).send()
}
