import type {Document} from '../../types/documents.js'

import {ListCommand} from '../../list-command.js'

export default class DocumentsList extends ListCommand<Document> {
  static override description = 'List documents'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  protected listPath = '/api/documents/'
  protected tableAttrs = ['id', 'title', 'created', 'added', 'correspondent', 'document_type', 'tags']

  protected override listParams(
    flags: Parameters<ListCommand['listParams']>[0],
  ): Record<string, number | string | string[] | undefined> {
    const params = super.listParams(flags)

    delete params.name__icontains
    // eslint-disable-next-line camelcase -- API uses double-underscore field names.
    params.title__icontains = flags['name-contains']

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
