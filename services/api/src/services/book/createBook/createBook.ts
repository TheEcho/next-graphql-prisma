import type { CreateBookInput } from 'generated/graphql-resolvers-types'
import type { Book } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const createBooks = async (
  { prisma }: GraphqlContext,
  { authorId, ...input }: CreateBookInput,
): Promise<Book> => {
  const book = await prisma.book.create({
    data: {
      ...input,
      author: {
        connect: { id: authorId },
      },
    },
    include: {
      author: true,
    },
  })

  return book
}
