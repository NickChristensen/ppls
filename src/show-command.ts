import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'
import {formatField, formatValue} from './table.js'

type ShowCommandArgs = {
  id: number | string
}

type ShowCommandFlags = ApiFlags & {
  plain?: boolean
  table?: boolean
}

type ShowTableRow = {
  field: string
  value: unknown
}

export abstract class ShowCommand<T extends Record<string, unknown> = Record<string, unknown>> extends BaseCommand {
  protected abstract plainTemplate(item: T): null | string | undefined

  protected renderShowOutput(options: {flags: ShowCommandFlags; result: T}): void {
    if (this.jsonEnabled()) {
      return
    }

    const {flags, result} = options

    if (flags.plain) {
      const line = this.plainTemplate(result)

      if (line) {
        this.log(line)
      }

      return
    }

    this.logTable(
      [
        {align: 'right', formatter: formatField, value: 'field'},
        {formatter: formatValue, value: 'value'},
      ],
      this.showRows(result),
      {showHeader: false},
    )
  }

  public async run(): Promise<T> {
    const {args, flags} = await this.parse()
    const apiFlags: ApiFlags = {
      hostname: flags.hostname,
      token: flags.token,
    }
    const outputFlags: ShowCommandFlags = {
      ...apiFlags,
      plain: flags.plain,
      table: flags.table,
    }
    const id = this.showId(args as ShowCommandArgs)
    const result = await this.fetchApiJson<T>(apiFlags, this.showPath(id))

    this.renderShowOutput({flags: outputFlags, result})

    return result
  }

  protected showId(args: ShowCommandArgs): number | string {
    return args.id
  }

  protected abstract showPath(id: number | string): string

  protected showRows(result: T): ShowTableRow[] {
    return Object.entries(result).map(([field, value]) => ({
      field,
      value,
    }))
  }
}
