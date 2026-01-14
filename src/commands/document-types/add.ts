import {Args} from '@oclif/core'

import type {DocumentType, DocumentTypeCreate} from '../../types/document-types.js'

import {AddCommand} from '../../add-command.js'

type DocumentTypesAddArgs = {
  name: string
}

export default class DocumentTypesAdd extends AddCommand<DocumentTypeCreate, DocumentType> {
  static override args = {
    name: Args.string({description: 'Document type name', required: true}),
  }
  static override description = 'Create a document type'
  static override examples = ['<%= config.bin %> <%= command.id %> "Invoice"']
  protected createPath = '/api/document_types/'

  protected buildPayload(args: unknown, _flags: Record<string, unknown>): DocumentTypeCreate {
    const typedArgs = args as DocumentTypesAddArgs

    return {
      'matching_algorithm': 6,
      name: typedArgs.name,
    }
  }

  protected plainTemplate(documentType: DocumentType): string | undefined {
    const count = documentType.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${documentType.id}] ${documentType.name}${suffix}`
  }
}
