export type MatchingAlgorithm = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type DataTypeEnum =
  | 'boolean'
  | 'date'
  | 'documentlink'
  | 'float'
  | 'integer'
  | 'longtext'
  | 'monetary'
  | 'select'
  | 'string'
  | 'url'

// RFC 3339 date/time formats per OpenAPI data types:
// https://spec.openapis.org/oas/v3.0.3#data-types
export type DateString = `${number}-${number}-${number}`

export type DateTimeString = `${number}-${number}-${number}T${number}:${number}:${number}${string}`
