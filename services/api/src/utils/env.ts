import { z } from 'zod'

const processEnvSchema = {
  CORS_DOMAIN: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  ENVIRONMENT: z.string().optional(),
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  PORT: z.string().optional(),
}

const processEnvValidator = z.object(processEnvSchema)

export type ValidatedEnv = z.infer<typeof processEnvValidator>

export function parseEnv(): ValidatedEnv {
  try {
    return processEnvValidator.parse(process.env)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Some mandatory environment variables are not set. Check your .env config`)
    throw err
  }
}

export const getEnvVar = (variableName: keyof ValidatedEnv): string | undefined =>
  process.env[variableName]

export const isProdEnvironment = (env?: ValidatedEnv): boolean =>
  (env ? env['ENVIRONMENT'] : getEnvVar('ENVIRONMENT')) === 'prod'
export const isLocalEnvironment = (): boolean => getEnvVar('NODE_ENV') === 'development'
export const isTestEnvironment = (): boolean => getEnvVar('ENVIRONMENT') === 'environment_test'
