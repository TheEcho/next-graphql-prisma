import type { Book } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const getBook = async ({ prisma }: GraphqlContext, id: string): Promise<Book> => {
  return prisma.book.findUniqueOrThrow({
    where: {
      id,
    },
  })
}
