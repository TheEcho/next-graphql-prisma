import type { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import Boom from '@hapi/boom'
import type { GraphqlContext } from 'schema/types'

import { convertBoomToApolloError } from './convertBoomToApollo'

type TArgs = Record<string, unknown>

export const graphQLErrorMiddleware = async (
  resolve: GraphQLFieldResolver<unknown, GraphqlContext, TArgs>,
  root: unknown,
  args: TArgs,
  ctx: GraphqlContext,
  info: GraphQLResolveInfo,
) => {
  try {
    const res = await resolve(root, args, ctx, info)

    if (res instanceof Boom.Boom) {
      throw res
    }

    if (res instanceof Error) {
      throw Boom.boomify(res)
    }

    return res
  } catch (e: unknown | Boom.Boom) {
    if (!(e instanceof Boom.Boom)) {
      throw convertBoomToApolloError(
        ctx,
        Boom.badRequest('An unknown error occurred.', { originalError: e }),
      )
    }

    throw convertBoomToApolloError(ctx, e)
  }
}
