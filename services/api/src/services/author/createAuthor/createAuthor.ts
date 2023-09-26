import type { Author, Prisma } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const createAuthor = async (
  { prisma }: GraphqlContext,
  input: Prisma.AuthorCreateInput,
): Promise<Author> => {
  return prisma.author.create({
    data: input,
  })
}
