import type { Author } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const getAuthor = async ({ prisma }: GraphqlContext, id: string): Promise<Author> => {
  return prisma.author.findUniqueOrThrow({
    where: {
      id,
    },
  })
}
