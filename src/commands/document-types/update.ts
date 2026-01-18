import {Args, Flags} from '@oclif/core'

import type {DocumentType, DocumentTypeUpdate} from '../../types/document-types.js'

import {UpdateCommand} from '../../update-command.js'

type DocumentTypesUpdateFlags = {
  name?: string
}

export default class DocumentTypesUpdate extends UpdateCommand<DocumentTypeUpdate, DocumentType> {
  static override args = {
    id: Args.integer({description: 'Document type id', required: true}),
  }
  static override description = 'Update a document type'
  static override examples = ['<%= config.bin %> <%= command.id %> 123 --name "Invoice"']
  static override flags = {
    name: Flags.string({description: 'Document type name'}),
  }

  protected buildPayload(_args: unknown, flags: Record<string, unknown>): DocumentTypeUpdate {
    const typedFlags = flags as DocumentTypesUpdateFlags

    return {
      name: typedFlags.name,
    }
  }

  protected plainTemplate(documentType: DocumentType): string | undefined {
    const count = documentType.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${documentType.id}] ${documentType.name}${suffix}`
  }

  protected updatePath(id: number | string): string {
    return `/api/document_types/${id}/`
  }
}
