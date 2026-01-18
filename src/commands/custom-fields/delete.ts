import {Args, Flags} from '@oclif/core'

import {DeleteCommand} from '../../delete-command.js'

export default class CustomFieldsDelete extends DeleteCommand {
  static override args = {
    id: Args.integer({description: 'Custom field id', required: true}),
  }
  static override description = 'Delete a custom field'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']
  static override flags = {
    yes: Flags.boolean({char: 'y', description: 'Skip confirmation prompt'}),
  }

  protected deleteLabel(id: number | string): string {
    return `custom field ${id}`
  }

  protected deletePath(id: number | string): string {
    return `/api/custom_fields/${id}/`
  }
}
