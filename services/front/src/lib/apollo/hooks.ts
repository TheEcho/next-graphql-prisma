import { DocumentNode } from 'graphql'
import { useEffect } from 'react'

import {
  ApolloError,
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  QueryTuple,
  useLazyQuery as useLazyQueryApollo,
  useMutation as useMutationApollo,
  useQuery as useQueryApollo,
} from '@apollo/client'

export type CallbackOptions = {
  onSuccess?: <TData>(data: TData) => void
  onError?: () => void
}

const logErrorMessage = (error?: string): void => {
  console.error(error)
}
const logError = (error?: ApolloError): void => {
  logErrorMessage(JSON.stringify(error, null, 2))
}

const useLogError = (error?: ApolloError): void => {
  useEffect(() => {
    if (error) {
      logError(error)
    }
  }, [error])
}

export const useMutation = <TData, TVars>(
  graphql: DocumentNode,
  options?: MutationHookOptions<TData, TVars>,
): MutationTuple<TData, TVars> => {
  const [mutation, { data, loading, error, ...rest }] = useMutationApollo<TData, TVars>(
    graphql,
    options,
  )

  useLogError(error)

  return [mutation, { data, loading, error, ...rest }]
}

export const useGeneratedMutation = <TData, TVars>(
  mutation: MutationTuple<TData, TVars>,
  { onSuccess, onError }: CallbackOptions,
): MutationTuple<TData, TVars> => {
  const [, { data, loading, error }] = mutation

  useEffect(() => {
    if (data && !loading) {
      if (onSuccess) {
        onSuccess<TData>(data)
      }
    }
    if (error && !loading) {
      if (onError) {
        onError()
      }
    }
  }, [loading])

  useLogError(error)

  return mutation
}

export const useGeneratedQueryWithError = <TData, TVars extends OperationVariables>(
  query: QueryResult<TData, TVars>,
): QueryResult<TData, TVars> => {
  const { error } = query
  useLogError(error)

  return query
}

export const useGeneratedLazyQueryWithError = <TData, TVars extends OperationVariables>(
  lazyQuery: QueryTuple<TData, TVars>,
): QueryTuple<TData, TVars> => {
  const [, { error }] = lazyQuery
  useLogError(error)

  return lazyQuery
}

export const useQueryWithError = <TData, TVars extends OperationVariables>(
  graphql: DocumentNode,
  options?: QueryHookOptions<TData, TVars>,
): QueryResult<TData, TVars> => {
  const result = useQueryApollo<TData, TVars>(graphql, options)
  const { error } = result

  useLogError(error)

  return result
}

export const useLazyQueryWithError = <TData, TVars extends OperationVariables>(
  graphql: DocumentNode,
  options?: QueryHookOptions<TData, TVars>,
): QueryTuple<TData, TVars> => {
  const result = useLazyQueryApollo<TData, TVars>(graphql, options)

  const [, { error }] = result

  useLogError(error)

  return result
}
