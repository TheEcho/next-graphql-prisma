import type { Book } from 'generated/graphql-resolvers-types'

import { getBooks } from 'services/book/getBooks/getBooks'

import type { GraphqlContext } from '../types'

export default {
  Query: {
    books: async (_: unknown, args: unknown, ctx: GraphqlContext): Promise<Book[]> => {
      return getBooks(ctx)
    },
  },
}
