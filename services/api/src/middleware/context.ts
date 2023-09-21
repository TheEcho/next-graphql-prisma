import type { PrismaClient } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'
import type { ValidatedEnv } from 'utils/env'
import { getLogger } from 'utils/logger'

export const contextMiddleware = async ({
  secret,
  env,
  prisma,
}: {
  secret: string
  env: ValidatedEnv
  prisma: PrismaClient
}): Promise<Omit<GraphqlContext, 'request'>> => {
  const log = getLogger()

  return { log, env, prisma }
}
