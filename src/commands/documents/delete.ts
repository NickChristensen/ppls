import {Args, Flags} from '@oclif/core'

import {DeleteCommand} from '../../delete-command.js'

export default class DocumentsDelete extends DeleteCommand {
  static override args = {
    id: Args.integer({description: 'Document id', required: true}),
  }
  static override description = 'Delete a document'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']
  static override flags = {
    yes: Flags.boolean({char: 'y', description: 'Skip confirmation prompt'}),
  }

  protected deleteLabel(id: number | string): string {
    return `document ${id}`
  }

  protected deletePath(id: number | string): string {
    return `/api/documents/${id}/`
  }
}
