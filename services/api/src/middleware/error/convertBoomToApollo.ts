import { GraphQLError } from 'graphql'

import type Boom from '@hapi/boom'
import type { GraphqlContext } from 'schema/types'
import { isProdEnvironment } from 'utils/env'

import { redactError } from './formatError'

/**
 * This function converts a Boom error to Apollo Error
 * It adds more information to the standard Apollo Error by using the `extensions` param, with :
 * - statusCode: HTTP status code
 * - data: data about the error, with at least a readable error to be used by clients to display to users :
 *    - errorCode: code of the error
 *    - errorMessage: message to be displayed to the user (except if client wants to handle it another way)
 */
export const convertBoomToApolloError = (
  ctx: Pick<GraphqlContext, 'request' | 'log'>,
  boomError: Boom.Boom<{}>,
): GraphQLError => {
  const { safeErrorData, sensitiveData } = redactError(ctx, boomError)

  ctx.log.error(sensitiveData, sensitiveData.errorMessage)

  const { errorMessage, errorCode, statusCode, data, stack } = isProdEnvironment()
    ? safeErrorData
    : sensitiveData

  const apolloError = new GraphQLError(errorMessage, {
    extensions: {
      statusCode,
      errorCode,
      data,
    },
  })
  apolloError.stack = stack

  return apolloError
}
