import {Args, Flags} from '@oclif/core'

import {DeleteCommand} from '../../delete-command.js'

export default class TagsDelete extends DeleteCommand {
  static override args = {
    id: Args.integer({description: 'Tag id', required: true}),
  }
  static override description = 'Delete a tag'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']
  static override flags = {
    yes: Flags.boolean({char: 'y', description: 'Skip confirmation prompt'}),
  }

  protected deleteLabel(id: number | string): string {
    return `tag ${id}`
  }

  protected deletePath(id: number | string): string {
    return `/api/tags/${id}/`
  }
}
