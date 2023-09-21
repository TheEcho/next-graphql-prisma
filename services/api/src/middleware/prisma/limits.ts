import { merge } from 'lodash'
import type { Logger } from 'pino'

import type { Prisma } from 'generated/prisma'

const ERROR_OP = 'Limits Middleware:'

export const QUERY_LIMIT = parseInt('15000')

type PrismaMiddlewareCallFn = (params: Prisma.MiddlewareParams) => Promise<unknown>

export const initLimitsMiddleware =
  ({ logger }: { logger: Logger }) =>
  async (params: Prisma.MiddlewareParams, next: PrismaMiddlewareCallFn): Promise<unknown> => {
    switch (params.action) {
      case 'queryRaw':
        const result = await next(params)
        const length = (result as any[]).length
        if (length >= QUERY_LIMIT) {
          logger.warn(
            `${ERROR_OP} QueryRaw got ${length} results. You should take a look at your query filter or increase the QUERY_LIMIT value.\nThe faulty query is: ${params?.args?.query}`,
          )
        }

        return result

      case 'findMany':
        if (!params?.args?.take) {
          params.args = merge(params.args, {
            take: QUERY_LIMIT,
          })
        } else if (!!params?.args?.take && params?.args?.take > QUERY_LIMIT) {
          throw Error(
            `${ERROR_OP} Got "take" > ${params?.args?.take}. You should use a "take" <= ${QUERY_LIMIT}`,
          )
        }

        const result_1 = await next(params)
        const length_1 = (result_1 as any[]).length
        if (length_1 >= QUERY_LIMIT) {
          throw Error(
            `${ERROR_OP} Got ${length_1} results. You should take a look at your query filter or increase the QUERY_LIMIT value`,
          )
        }

        return result_1

      default:
        return next(params)
    }
  }
