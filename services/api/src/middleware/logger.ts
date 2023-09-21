import cuid from 'cuid'
import type { RequestHandler } from 'express'
import { get, gte } from 'lodash'

import { getLogger } from 'utils/logger'

export const loggingMiddleware: RequestHandler = (req, res, next) => {
  const rootLogger = getLogger()

  req.id = get(req, 'headers.x-request-id', req.id || cuid()) as string

  // Initialize bindings
  const log = rootLogger.child({
    req,
    res,
  })

  // Attach logger and start time to req
  req.log = log
  req.startTime = Date.now()

  req.log.info('Query started')

  res.on('finish', () => {
    const statusCode = get(res, 'statusCode', 200)

    res.responseTime = Date.now() - req.startTime
    req.log = req.log.child({
      req,
      res,
    })

    const method = 'info'

    req.log[method](gte(statusCode, 400) ? 'Query error' : 'Query success')
  })

  next()
}
