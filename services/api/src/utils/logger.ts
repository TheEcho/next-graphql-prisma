import cuid from 'cuid'
import type { Request, Response } from 'express'
import pino from 'pino'

import { getEnvVar, isLocalEnvironment } from './env'

const logger = pino({
  name: getEnvVar('ENVIRONMENT'),
  // pino recommends against prettifying in production
  ...(isLocalEnvironment() && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: true,
        messageFormat:
          '{msg} - {req.id} - {req.contentLength} octets - {res.responseTime} ms - {req.operationName}',
        ignore: 'hostname',
      },
    },
  }),
  redact: [
    'req.variables.password',
    'req.variables.newPassword',
    'req.variables.previousPassword',
    'req.variables.resetPasswordToken',
  ],
  nestedKey: 'payload',
  serializers: {
    req: (req: Request) => ({
      id: req?.id,
      contentLength: req?.headers?.['content-length'] || 'n/a',
      variables: req?.body?.variables || {},
      method: req.method,
      // Some scripts are using this serializer method
      // Like src/bin/calendar_event/resyncUpcomingCalendarEvents/start.js
      // Then we should consider that this property is optionnal
      ...(req.prisma?._internalCount && { prismaCalls: req.prisma?._internalCount }),
    }),
    res: (res: Response) => ({
      ...(res.responseTime && {
        responseTime: res.responseTime,
      }),
    }),
    err: err => ({
      err,
    }),
  },
})

/**
 * Prefer ctx.log or req.log if an express context request is available (it will be set by the middleware)
 * If not, use this method and pass initReqId
 */
export const getLogger = (initReqId?: boolean): pino.Logger => {
  if (!!initReqId) {
    return logger.child({
      req: {
        id: cuid(),
      },
    })
  }

  return logger
}
