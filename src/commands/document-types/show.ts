import {Args} from '@oclif/core'

import type {DocumentType} from '../../types/document-types.js'

import {ShowCommand} from '../../show-command.js'

export default class DocumentTypesShow extends ShowCommand<DocumentType> {
  static override args = {
    id: Args.integer({description: 'Document type id', required: true}),
  }
  static override description = 'Show document type details'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']

  protected plainTemplate(documentType: DocumentType): string | undefined {
    const count = documentType.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${documentType.id}] ${documentType.name}${suffix}`
  }

  protected showPath(id: number | string): string {
    return `/api/document_types/${id}/`
  }
}
