import type { Pool } from 'pg'
import type { Logger } from 'pino'

import type { PrismaClient } from 'generated/prisma'
import type { JobQueueClient } from 'tasks/graphile-worker/types'
import type { Viewer } from 'utils/auth/jwt'
import type { ValidatedEnv } from 'utils/env'
import type { FeatureFlagsService } from 'utils/featureFlags/featureFlags'

declare global {
  namespace Express {
    interface Request {
      id?: string
      prisma: PrismaClient & { _internalCount: number }
      log: Logger
      startTime: number
      user?: Viewer
      auth: AuthContext
      front: FrontContext
      pgPool: Pool
      env: ValidatedEnv
      featureFlags: FeatureFlagsService
      jobQueueClient: JobQueueClient
    }

    interface Response {
      responseTime: number
      body: any
    }
  }
}

export {}
