import type { Request } from 'express'
import type { Logger } from 'pino'

import type { PrismaClient } from 'generated/prisma'

import type { ValidatedEnv } from '../utils/env'

export type GraphqlContext = {
  request: Request
  log: Logger
  env: ValidatedEnv
  prisma: PrismaClient
}
