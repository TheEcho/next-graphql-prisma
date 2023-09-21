export type ErrorOutput = [code: number, message: string]

const ERRORS = {
  Default: {
    DefaultError: [
      1,
      'Une erreur technique est survenue, veuillez réessayer dans quelques instants.',
    ],
  },
  /** Authorization */
  API_Auth: {
    invalid_auth: [99, "Vous n'êtes pas autorisé à accéder à cette page"],
    connexion_needed: [98, 'Connexion nécessaire'],
    unauthorized: [97, `Vous n'êtes pas autorisé à effectuer cette action`],
  },
} satisfies Record<string, Record<string, ErrorOutput | ((...args: any[]) => ErrorOutput)>>

export const ensureErrorCodesUnicity = (): void => {
  const errorCodes: number[] = []
  const duplicatedErrorCodes: number[] = []
  for (const key of Object.keys(ERRORS) as Array<keyof typeof ERRORS>) {
    const errorDomain: any = ERRORS[key]
    for (const errorKey of Object.keys(errorDomain)) {
      const error =
        typeof errorDomain[errorKey] === 'function'
          ? errorDomain[errorKey]()
          : errorDomain[errorKey]
      const [errorCode] = error
      if (errorCodes.includes(errorCode)) {
        duplicatedErrorCodes.push(errorCode)
      }
      errorCodes.push(errorCode)
    }
  }
  if (duplicatedErrorCodes.length) {
    throw Error(`Multiple error codes define : ${duplicatedErrorCodes.join(', ')}`)
  }
}

export default ERRORS
