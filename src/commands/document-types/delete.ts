import {Args, Flags} from '@oclif/core'

import {DeleteCommand} from '../../delete-command.js'

export default class DocumentTypesDelete extends DeleteCommand {
  static override args = {
    id: Args.integer({description: 'Document type id', required: true}),
  }
  static override description = 'Delete a document type'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']
  static override flags = {
    yes: Flags.boolean({char: 'y', description: 'Skip confirmation prompt'}),
  }

  protected deleteLabel(id: number | string): string {
    return `document type ${id}`
  }

  protected deletePath(id: number | string): string {
    return `/api/document_types/${id}/`
  }
}
