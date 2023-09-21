import { json } from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import type { Application } from 'express'
import express from 'express'
import { applyMiddleware } from 'graphql-middleware'
import { createServer } from 'http'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { PrismaClient } from 'generated/prisma'
import { contextMiddleware } from 'middleware/context'
import { initLimitsMiddleware } from 'middleware/prisma/limits'
import { getLogger } from 'utils/logger'

import { addResponseToBody } from './middleware/addResponseBody'
import cors from './middleware/cors'
import { expressErrorMiddleware, graphQLErrorMiddleware } from './middleware/error'
import { loggingMiddleware } from './middleware/logger'
import { resolvers, typeDefs } from './schema'
import { getEnvVar, parseEnv } from './utils/env'

const logger = getLogger()

const application = express()
const httpServer = createServer(application)
const PORT = getEnvVar('PORT')
const isDevEnvironment = getEnvVar('NODE_ENV') === 'development'

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
})

prisma.$use(initLimitsMiddleware({ logger }))

async function startGraphqlServer(app: Application): Promise<void> {
  const graphqlPath = '/graphql'
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const apolloServer = new ApolloServer({
    schema: applyMiddleware(schema, graphQLErrorMiddleware),
    plugins: [
      isDevEnvironment
        ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
        : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  })

  await apolloServer.start()

  app.use(
    graphqlPath,
    cors(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return {
          request: req,
          log: req.log,
          env: req.env,
          prisma: req.prisma,
        }
      },
    }),
  )

  logger.info(`🚀 [API Graphql] Server ready at http://localhost:${PORT}${graphqlPath}`)
}

export const server = async () => {
  const env = parseEnv()

  // Middlewares added to the express server directly will be called before graphql specific middlewares,
  // if they match the graphql route (/graphql)
  application.use(compression())

  application.use(cors())

  application.use(express.urlencoded({ extended: true }))
  application.use(
    express.json({
      limit: '50mb',
      verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          req.rawBody = buf.toString((encoding as BufferEncoding) || 'utf-8')
        }
      },
    }),
  )

  application.use(cookieParser())

  application.use(async (req, _, next) => {
    const context = await contextMiddleware({ env, secret: '', prisma })
    Object.assign(req, context)
    next()
  })

  application.use(loggingMiddleware)

  // Added after rest routes because addResponseToBody causes infinite loop with our rest API
  application.use(addResponseToBody)

  // Error middleware
  // Here we catch any error from a previous middleware
  application.use(expressErrorMiddleware)

  await new Promise<void>(resolve => httpServer.listen({ port: PORT || undefined }, resolve))

  await startGraphqlServer(application)
}

// Launch the server
server()
