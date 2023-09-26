import type { Book } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const getBooks = async ({
  prisma,
}: GraphqlContext): Promise<{ books: Book[]; total: Number }> => {
  const total = await prisma.book.count()
  const books = await prisma.book.findMany()

  return { books, total }
}
