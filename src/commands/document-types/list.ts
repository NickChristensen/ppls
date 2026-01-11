import type {DocumentType} from '../../types/document-types.js'

import {ListCommand} from '../../list-command.js'

export default class DocumentTypesList extends ListCommand<DocumentType> {
  static override description = 'List document types'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  protected listPath = '/api/document_types/'
  protected tableAttrs = ['id', 'name', 'slug', 'document_count']

  protected plainTemplate(documentType: DocumentType): string | undefined {
    const count = documentType.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${documentType.id}] ${documentType.name}${suffix}`
  }
}
