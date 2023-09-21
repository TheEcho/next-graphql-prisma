import type { Book, Prisma } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const createBooks = async (
  { prisma }: GraphqlContext,
  input: Prisma.BookCreateInput,
): Promise<Book> => {
  return prisma.book.create({
    data: input,
  })
}
