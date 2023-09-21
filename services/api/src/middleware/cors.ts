import cors from 'cors'
import _isEmpty from 'lodash/isEmpty'

import { getEnvVar } from 'utils/env'

const CORS_DOMAIN = getEnvVar('CORS_DOMAIN')
const ALLOWED_CORS_DOMAIN = CORS_DOMAIN?.split(',') ?? []

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      _isEmpty(origin) ||
      origin === 'null' ||
      (!!origin && ALLOWED_CORS_DOMAIN.indexOf(origin) !== -1)
    ) {
      callback(null, origin)
    } else {
      callback(new Error(`Origin '${origin}' not allowed by CORS`), false)
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

export default () => cors<cors.CorsRequest>(corsOptions)
