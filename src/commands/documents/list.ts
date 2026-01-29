import {Flags} from '@oclif/core'

import type {Document} from '../../types/documents.js'

import {dateLike} from '../../flags/date-like.js'
import {isDateOnly} from '../../helpers/date-utils.js'
import {ListCommand} from '../../list-command.js'

type DocumentsListFlags = {
  'added-after'?: string
  'added-before'?: string
  correspondent?: number[]
  'correspondent-not'?: number[]
  'created-after'?: string
  'created-before'?: string
  'document-type'?: number[]
  'document-type-not'?: number[]
  'modified-after'?: string
  'modified-before'?: string
  'no-correspondent'?: boolean
  'no-document-type'?: boolean
  'no-tag'?: boolean
  tag?: number[]
  'tag-all'?: number[]
  'tag-not'?: number[]
}

type DateRangeFields = {
  after: string
  before: string
}

type DateRangeFlagGroups = {
  added: DateRangeFields
  created: DateRangeFields
  modified: DateRangeFields
}

const DATE_RANGE_FLAGS = {
  added: {
    after: 'added-after',
    before: 'added-before',
  },
  created: {
    after: 'created-after',
    before: 'created-before',
  },
  modified: {
    after: 'modified-after',
    before: 'modified-before',
  },
} as const satisfies DateRangeFlagGroups

type DateRangeFlagName = (typeof DATE_RANGE_FLAGS)[keyof typeof DATE_RANGE_FLAGS]['after' | 'before']

const addDateRangeParams = (
  params: Record<string, number | number[] | string | string[] | undefined>,
  field: keyof DateRangeFlagGroups,
  flags: DocumentsListFlags,
): void => {
  const {after, before} = DATE_RANGE_FLAGS[field]
  const typedFlags = flags as Record<DateRangeFlagName, string | undefined>
  const afterValue = typedFlags[after]
  const beforeValue = typedFlags[before]

  if (afterValue) {
    const key = isDateOnly(afterValue) ? `${field}__date__gte` : `${field}__gte`
    params[key] = afterValue
  }

  if (beforeValue) {
    const key = isDateOnly(beforeValue) ? `${field}__date__lte` : `${field}__lte`
    params[key] = beforeValue
  }
}

export default class DocumentsList extends ListCommand<Document> {
  static override description = 'List documents'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    ...ListCommand.baseFlags,
    'added-after': dateLike({
      description: 'Filter by added date (YYYY-MM-DD) or datetime (ISO 8601) >= value',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    'added-before': dateLike({
      description: 'Filter by added date (YYYY-MM-DD) or datetime (ISO 8601) <= value',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    correspondent: Flags.integer({
      delimiter: ',',
      description: 'Filter by correspondent ids (repeatable or comma-separated)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'correspondent-not': Flags.integer({
      delimiter: ',',
      description: 'Exclude correspondent ids (repeatable or comma-separated)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'created-after': dateLike({
      description: 'Filter by created date (YYYY-MM-DD) or datetime (ISO 8601) >= value',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    'created-before': dateLike({
      description: 'Filter by created date (YYYY-MM-DD) or datetime (ISO 8601) <= value',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    'document-type': Flags.integer({
      delimiter: ',',
      description: 'Filter by document type ids (repeatable or comma-separated)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'document-type-not': Flags.integer({
      delimiter: ',',
      description: 'Exclude document type ids (repeatable or comma-separated)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'modified-after': dateLike({
      description: 'Filter by modified date (YYYY-MM-DD) or datetime (ISO 8601) >= value',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    'modified-before': dateLike({
      description: 'Filter by modified date (YYYY-MM-DD) or datetime (ISO 8601) <= value',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    'no-correspondent': Flags.boolean({
      description: 'Filter documents with no correspondent',
      exclusive: ['correspondent', 'correspondent-not', 'id-in'],
      helpGroup: 'FILTER',
    }),
    'no-document-type': Flags.boolean({
      description: 'Filter documents with no document type',
      exclusive: ['document-type', 'document-type-not', 'id-in'],
      helpGroup: 'FILTER',
    }),
    'no-tag': Flags.boolean({
      description: 'Filter documents with no tags',
      exclusive: ['tag', 'tag-all', 'tag-not', 'id-in'],
      helpGroup: 'FILTER',
    }),
    tag: Flags.integer({
      delimiter: ',',
      description: 'Filter by tag ids (repeatable or comma-separated, OR)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'tag-all': Flags.integer({
      delimiter: ',',
      description: 'Filter by tag ids (repeatable or comma-separated, AND)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'tag-not': Flags.integer({
      delimiter: ',',
      description: 'Exclude tag ids (repeatable or comma-separated)',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
  }
  protected listPath = '/api/documents/'
  protected tableAttrs = ['id', 'title', 'created', 'added', 'correspondent', 'document_type', 'tags']

  protected override extraListFlags(flags: Record<string, unknown>): Record<string, unknown> {
    const typedFlags = flags as DocumentsListFlags

    return {
      'added-after': typedFlags['added-after'],
      'added-before': typedFlags['added-before'],
      correspondent: typedFlags.correspondent,
      'correspondent-not': typedFlags['correspondent-not'],
      'created-after': typedFlags['created-after'],
      'created-before': typedFlags['created-before'],
      'document-type': typedFlags['document-type'],
      'document-type-not': typedFlags['document-type-not'],
      'modified-after': typedFlags['modified-after'],
      'modified-before': typedFlags['modified-before'],
      'no-correspondent': typedFlags['no-correspondent'],
      'no-document-type': typedFlags['no-document-type'],
      'no-tag': typedFlags['no-tag'],
      tag: typedFlags.tag,
      'tag-all': typedFlags['tag-all'],
      'tag-not': typedFlags['tag-not'],
    }
  }

  protected override listParams(
    flags: Parameters<ListCommand['listParams']>[0],
  ): Record<string, number | number[] | string | string[] | undefined> {
    const typedFlags = flags as DocumentsListFlags & Parameters<ListCommand['listParams']>[0]
    const params = super.listParams(flags)

    delete params.name__icontains
    /* eslint-disable camelcase -- API uses double-underscore field names. */
    params.title__icontains = flags['name-contains']
    params.tags__id__in = typedFlags.tag
    params.tags__id__all = typedFlags['tag-all']
    params.tags__id__none = typedFlags['tag-not']
    params.is_tagged = typedFlags['no-tag'] ? 'false' : undefined
    params.correspondent__id__in = typedFlags.correspondent
    params.correspondent__id__none = typedFlags['correspondent-not']
    params.correspondent__isnull = typedFlags['no-correspondent'] ? 'true' : undefined
    params.document_type__id__in = typedFlags['document-type']
    params.document_type__id__none = typedFlags['document-type-not']
    params.document_type__isnull = typedFlags['no-document-type'] ? 'true' : undefined
    /* eslint-enable camelcase */
    addDateRangeParams(params, 'added', typedFlags)
    addDateRangeParams(params, 'created', typedFlags)
    addDateRangeParams(params, 'modified', typedFlags)

    return params
  }

  protected plainTemplate(document: Document): string | undefined {
    const title = document.title?.trim()
    if (!title) {
      return
    }

    return `[${document.id}] ${title}`
  }
}
