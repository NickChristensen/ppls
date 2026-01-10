import {Args} from '@oclif/core'

import type {Correspondent} from '../../types/correspondents.js'

import {ShowCommand} from '../../show-command.js'
import {formatField, formatValue} from '../../table.js'

export default class CorrespondentsShow extends ShowCommand {
  static override args = {
    id: Args.integer({description: 'Correspondent id', required: true}),
  }
  static override description = 'Show correspondent details'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']

  public async run(): Promise<Correspondent> {
    const {args, flags} = await this.parse(CorrespondentsShow)
    const result = await this.fetchApiJson<Correspondent>(flags, `/api/correspondents/${args.id}/`)

    if (flags.plain) {
      const count = result.document_count
      const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

      this.log(`[${result.id}] ${result.name}${suffix}`)
    } else {
      const rows = Object.entries(result).map(([field, value]) => ({
        field,
        value,
      }))

      this.logTable(
        [
          {align: 'right', formatter: formatField, value: 'field'},
          {formatter: formatValue, value: 'value'},
        ],
        rows,
        {showHeader: false},
      )
    }

    return result
  }
}
