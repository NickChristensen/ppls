import type {DateString, DateTimeString} from './shared.js'

export type DocumentNote = {
  created?: DateTimeString
  id: number
  note?: string
  user?: {
    email?: string
    first_name?: string
    id?: number
    last_name?: string
    username?: string
  }
}

export type CustomFieldInstance = {
  field: number
  value: null | number | object | string
}

export type DocumentCreate = {
  archive_serial_number?: number
  correspondent?: null | number
  created?: DateTimeString
  document_type?: null | number
  storage_path?: null | number
  tags?: number[]
  title?: string
}

export type DocumentUpdate = {
  archive_serial_number?: null | number
  content?: string
  correspondent?: null | number
  created?: DateString
  document_type?: null | number
  storage_path?: null | number
  tags?: number[]
  title?: string
}

export type Document = {
  added: DateTimeString
  archive_serial_number?: null | number
  archived_file_name?: null | string
  content?: string
  correspondent: null | number
  created: DateString
  created_date?: DateString
  custom_fields?: CustomFieldInstance[]
  deleted_at?: DateTimeString | null
  document_type: null | number
  id: number
  is_shared_by_requester?: boolean
  mime_type?: string
  modified?: DateTimeString
  notes?: DocumentNote[]
  original_file_name?: null | string
  owner?: null | number
  page_count?: null | number
  permissions?: {
    change?: {
      groups?: number[]
      users?: number[]
    }
    view?: {
      groups?: number[]
      users?: number[]
    }
  }
  storage_path: null | number
  tags: number[]
  title?: string
  user_can_change?: boolean
}
