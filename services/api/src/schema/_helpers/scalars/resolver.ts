import { GraphQLScalarType } from 'graphql'
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLJSONObject } from 'graphql-type-json'

export const Date = GraphQLDate
export const DateTime = GraphQLDateTime
export const Time = GraphQLTime
export const JSON = GraphQLJSON
export const JSONObject = GraphQLJSONObject
export const Void = new GraphQLScalarType({
  name: 'Void',
  description: 'Represents no values',
  serialize: () => null,
  parseValue: () => null,
  parseLiteral: () => null,
})
