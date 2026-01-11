import type {MatchingAlgorithm} from './shared.js'

type TagBase = {
  color?: string
  document_count: number
  id: number
  is_inbox_tag?: boolean
  is_insensitive?: boolean
  match?: string
  matching_algorithm?: MatchingAlgorithm
  name: string
  owner?: null | number
  parent?: null | number
  slug: string
  text_color: string
  user_can_change: boolean
}

export type Tag = TagBase & {
  children: number[]
}

export type TagApi = TagBase & {
  children: TagApi[]
}
