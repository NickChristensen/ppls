import type {MatchingAlgorithm} from './shared.js'

export type DocumentType = {
  document_count: number
  id: number
  is_insensitive?: boolean
  match?: string
  matching_algorithm?: MatchingAlgorithm
  name: string
  owner?: null | number
  permissions: {
    change: {
      groups: number[]
      users: number[]
    }
    view: {
      groups: number[]
      users: number[]
    }
  }
  slug: string
  user_can_change: boolean
}

export type DocumentTypeCreate = {
  matching_algorithm?: MatchingAlgorithm
  name: string
}

export type DocumentTypeUpdate = Partial<DocumentTypeCreate>
