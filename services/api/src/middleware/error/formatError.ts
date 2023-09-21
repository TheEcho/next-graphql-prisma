import _ from 'lodash'

import type Boom from '@hapi/boom'
import type { GraphqlContext } from 'schema/types'
import ERRORS from 'utils/errors'

type BoomError = Boom.Boom<{
  error?: [number, string]
  [key: string]: unknown
}>

type Output = {
  statusCode: number
  errorCode: number
  errorMessage: string
  requestId: string
  graphqlOperation: string
  data?: any
  stack?: string
}

export const redactError = (
  ctx: Pick<GraphqlContext, 'request'>,
  boomError: BoomError,
): { safeErrorData: Output; sensitiveData: Output } => {
  const {
    message,
    data,
    output: {
      payload: { statusCode },
    },
    stack,
  } = boomError

  // additional data is passed manually when throwing an error
  const { error, ...additionalData } = data || {}

  // from utils/errors.ts dictionary
  let [errorCode, errorMessage] = ERRORS.Default.DefaultError as [number, string]
  if (Array.isArray(error) && typeof error[0] === 'number' && typeof error[1] === 'string') {
    ;[errorCode, errorMessage] = error
  }

  /**
   * Use error message as friendly user message for 401
   * Boom doesn't allow to use standard { error } for Boom.unauthorized
   * */
  if (statusCode === 401) {
    errorMessage = message
  }

  const baseData = {
    statusCode,
    errorCode,
    errorMessage, // user friendly message.
    requestId: ctx.request.id as string,
    graphqlOperation: ctx.request.body.operationName as string,
    stack,
    data: {
      message, // coders error message.
      variables: _.omit(ctx.request.body.variables, [
        'password',
        'newPassword',
        'previousPassword',
        'resetPasswordToken',
      ]),
    },
  }

  const fullData = {
    ...baseData,
    data: {
      ...baseData.data,
      ...additionalData,
    },
  }

  return {
    safeErrorData: baseData,
    sensitiveData: fullData,
  }
}
