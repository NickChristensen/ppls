import type {DataTypeEnum} from './shared.js'

export type CustomField = {
  data_type: DataTypeEnum
  document_count: number
  extra_data?: null | Record<string, unknown>
  id: number
  name: string
}

export type CustomFieldCreate = {
  data_type: DataTypeEnum
  extra_data?: {
    select_options: Array<{label: string}>
  }
  name: string
}

export type CustomFieldUpdate = Partial<CustomFieldCreate>
