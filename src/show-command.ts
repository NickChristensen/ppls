import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'
import {createValueFormatter, formatField} from './helpers/table.js'

type ShowCommandArgs = {
  id: number | string
}

type ShowCommandFlags = ApiFlags & {
  'date-format': string
  plain?: boolean
  table?: boolean
}

type ShowTableRow = {
  field: string
  value: unknown
}

export abstract class ShowCommand<
  TRaw extends Record<string, unknown> = Record<string, unknown>,
  TOutput extends Record<string, unknown> = TRaw,
> extends BaseCommand {
  protected abstract plainTemplate(item: TOutput): null | string | undefined

  protected renderShowOutput(options: {flags: ShowCommandFlags; result: TOutput}): void {
    if (this.jsonEnabled()) {
      return
    }

    const {flags, result} = options
    const dateFormat = flags['date-format'] as string

    if (flags.plain) {
      const line = this.plainTemplate(result)

      if (line) {
        this.log(line)
      }

      return
    }

    const valueFormatter = createValueFormatter(dateFormat)

    this.logTable(
      [
        {align: 'right', formatter: formatField, value: 'field'},
        {formatter: valueFormatter, value: 'value'},
      ],
      this.showRows(result),
      {showHeader: false},
    )
  }

  public async run(): Promise<TOutput> {
    const {args, flags, metadata} = await this.parse()
    const {dateFormat, ...apiFlags} = await this.resolveGlobalFlags(flags, metadata)
    const outputFlags: ShowCommandFlags = {
      ...apiFlags,
      'date-format': dateFormat,
      plain: flags.plain,
      table: flags.table,
    }
    const id = this.showId(args as ShowCommandArgs)
    const rawResult = await this.fetchApiJson<TRaw>(apiFlags, this.showPath(id))
    const result = this.transformResult(rawResult)

    this.renderShowOutput({flags: outputFlags, result})

    return result
  }

  protected showId(args: ShowCommandArgs): number | string {
    return args.id
  }

  protected abstract showPath(id: number | string): string

  protected showRows(result: TOutput): ShowTableRow[] {
    return Object.entries(result).map(([field, value]) => ({
      field,
      value,
    }))
  }

  protected transformResult(result: TRaw): TOutput {
    return result as unknown as TOutput
  }
}
