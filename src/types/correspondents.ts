import type {MatchingAlgorithm} from './shared.js'

export type Correspondent = {
  document_count: number
  id: number
  is_insensitive?: boolean
  last_correspondence: string
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

export type CorrespondentCreate = {
  matching_algorithm?: MatchingAlgorithm
  name: string
}

export type CorrespondentUpdate = Partial<CorrespondentCreate>
