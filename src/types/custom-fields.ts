import type {DataTypeEnum} from './shared.js'

export type CustomField = {
  data_type: DataTypeEnum
  document_count: number
  extra_data?: null | Record<string, unknown>
  id: number
  name: string
}
