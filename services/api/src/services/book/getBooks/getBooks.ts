import type { Book } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const getBooks = async ({ prisma }: GraphqlContext): Promise<Book[]> => {
  return prisma.book.findMany()
}
