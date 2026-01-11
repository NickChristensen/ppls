export type DocumentNote = {
  created?: string
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

export type Document = {
  added: string
  archive_serial_number?: null | number
  archived_file_name?: null | string
  content?: string
  correspondent: null | number
  created: string
  created_date?: string
  custom_fields?: CustomFieldInstance[]
  deleted_at?: null | string
  document_type: null | number
  id: number
  is_shared_by_requester?: boolean
  mime_type?: string
  modified?: string
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
