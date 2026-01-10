import type {Correspondent} from '../../types/correspondents.js'

import {ListCommand} from '../../list-command.js'

export default class CorrespondentsList extends ListCommand<Correspondent> {
  static override description = 'List correspondents'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  protected listPath = '/api/correspondents/'
  protected tableAttrs = ['id', 'name', 'slug', 'document_count']

  protected plainTemplate(correspondent: Correspondent): string | undefined {
    if (!correspondent.name) {
      return
    }

    const count = correspondent.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${correspondent.id}] ${correspondent.name}${suffix}`
  }
}
