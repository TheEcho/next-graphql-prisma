import type { MutationCreateAuthorArgs } from 'generated/graphql-resolvers-types'

import { createAuthor } from 'services/author/createAuthor/createAuthor'

import type { GraphqlContext } from '../types'

export default {
  Mutation: {
    createAuthor: async (_: unknown, { input }: MutationCreateAuthorArgs, ctx: GraphqlContext) => {
      const author = await createAuthor(ctx, input)

      return { author }
    },
  },
}
