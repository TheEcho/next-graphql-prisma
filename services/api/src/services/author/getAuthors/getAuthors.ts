import type { Author } from 'generated/prisma'
import type { GraphqlContext } from 'schema/types'

export const getAuthors = async (
  ctx: GraphqlContext,
): Promise<{ authors: Author[]; total: Number }> => {
  const total = await ctx.prisma.author.count()
  const authors = await ctx.prisma.author.findMany()

  return { authors, total }
}
