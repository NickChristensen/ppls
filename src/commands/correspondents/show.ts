import {Args} from '@oclif/core'

import type {Correspondent} from '../../types/correspondents.js'

import {ShowCommand} from '../../show-command.js'

export default class CorrespondentsShow extends ShowCommand<Correspondent> {
  static override args = {
    id: Args.integer({description: 'Correspondent id', required: true}),
  }
  static override description = 'Show correspondent details'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']

  protected plainTemplate(correspondent: Correspondent): string | undefined {
    const count = correspondent.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${correspondent.id}] ${correspondent.name}${suffix}`
  }

  protected showPath(id: number | string): string {
    return `/api/correspondents/${id}/`
  }
}
