import type {Document} from '../../types/documents.js'

import {ListCommand} from '../../list-command.js'
import {isDateOnly} from '../../helpers/date-utils.js'
import {dateLike} from '../../flags/date-like.js'

type DocumentsListFlags = {
  'added-after'?: string
  'added-before'?: string
  'created-after'?: string
  'created-before'?: string
  'modified-after'?: string
  'modified-before'?: string
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

const DATE_RANGE_FLAGS: DateRangeFlagGroups = {
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
}

const addDateRangeParams = (
  params: Record<string, number | string | string[] | undefined>,
  field: keyof DateRangeFlagGroups,
  flags: DocumentsListFlags,
): void => {
  const {after, before} = DATE_RANGE_FLAGS[field]
  const afterValue = flags[after]
  const beforeValue = flags[before]

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
    }),
    'added-before': dateLike({
      description: 'Filter by added date (YYYY-MM-DD) or datetime (ISO 8601) <= value',
    }),
    'created-after': dateLike({
      description: 'Filter by created date (YYYY-MM-DD) or datetime (ISO 8601) >= value',
    }),
    'created-before': dateLike({
      description: 'Filter by created date (YYYY-MM-DD) or datetime (ISO 8601) <= value',
    }),
    'modified-after': dateLike({
      description: 'Filter by modified date (YYYY-MM-DD) or datetime (ISO 8601) >= value',
    }),
    'modified-before': dateLike({
      description: 'Filter by modified date (YYYY-MM-DD) or datetime (ISO 8601) <= value',
    }),
  }
  protected listPath = '/api/documents/'
  protected tableAttrs = ['id', 'title', 'created', 'added', 'correspondent', 'document_type', 'tags']

  protected override extraListFlags(flags: Record<string, unknown>): Record<string, unknown> {
    const typedFlags = flags as DocumentsListFlags

    return {
      'added-after': typedFlags['added-after'],
      'added-before': typedFlags['added-before'],
      'created-after': typedFlags['created-after'],
      'created-before': typedFlags['created-before'],
      'modified-after': typedFlags['modified-after'],
      'modified-before': typedFlags['modified-before'],
    }
  }

  protected override listParams(
    flags: Parameters<ListCommand['listParams']>[0],
  ): Record<string, number | string | string[] | undefined> {
    const typedFlags = flags as Parameters<ListCommand['listParams']>[0] & DocumentsListFlags
    const params = super.listParams(flags)

    delete params.name__icontains
    // eslint-disable-next-line camelcase -- API uses double-underscore field names.
    params.title__icontains = flags['name-contains']
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
