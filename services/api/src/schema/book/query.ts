import type { QueryBookArgs } from 'generated/graphql-resolvers-types'

import { getBook } from 'services/book/getBook/getBook'
import { getBooks } from 'services/book/getBooks/getBooks'

import type { GraphqlContext } from '../types'

export default {
  Query: {
    books: async (_: unknown, args: unknown, ctx: GraphqlContext) => {
      return getBooks(ctx)
    },
    book: async (_: unknown, args: QueryBookArgs, ctx: GraphqlContext) => {
      return { book: await getBook(ctx, args.id) }
    },
  },
}
