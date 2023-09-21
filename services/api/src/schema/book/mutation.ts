import type { Book, MutationCreateBookArgs } from 'generated/graphql-resolvers-types'

import { createBooks } from 'services/book/createBook/createBook'

import type { GraphqlContext } from '../types'

export default {
  Mutation: {
    createBook: async (
      _: unknown,
      { input }: MutationCreateBookArgs,
      ctx: GraphqlContext,
    ): Promise<{ book: Book }> => {
      const book = await createBooks(ctx, input)

      return { book }
    },
  },
}
