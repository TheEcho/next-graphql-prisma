import type { Author, Book } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export default {
  Author: {
    books: async (parent: Author, args: unknown, ctx: GraphqlContext): Promise<Book[]> => {
      return ctx.prisma.author
        .findUniqueOrThrow({
          where: {
            id: parent.id,
          },
        })
        .books()
    },
  },
}
