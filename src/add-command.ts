import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'
import {createValueFormatter, formatField} from './helpers/table.js'

type AddCommandFlags = ApiFlags & {
  'date-format': string
  plain?: boolean
  table?: boolean
}

type AddTableRow = {
  field: string
  value: unknown
}

export abstract class AddCommand<
  TCreate = Record<string, unknown>,
  TRaw extends Record<string, unknown> = Record<string, unknown>,
  TOutput extends Record<string, unknown> = TRaw,
> extends BaseCommand {
  protected abstract createPath: string

  protected addRows(result: TOutput): AddTableRow[] {
    return Object.entries(result).map(([field, value]) => ({
      field,
      value,
    }))
  }

  protected abstract buildPayload(args: unknown, flags: Record<string, unknown>): TCreate

  protected abstract plainTemplate(item: TOutput): null | string | undefined

  protected renderAddOutput(options: {flags: AddCommandFlags; result: TOutput}): void {
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
      this.addRows(result),
      {showHeader: false},
    )
  }

  public async run(): Promise<TOutput> {
    const {args, flags, metadata} = await this.parse()
    const {dateFormat, ...apiFlags} = await this.resolveGlobalFlags(flags, metadata)
    const outputFlags: AddCommandFlags = {
      ...apiFlags,
      'date-format': dateFormat,
      plain: flags.plain,
      table: flags.table,
    }
    const payload = this.buildPayload(args, flags)
    const rawResult = await this.postApiJson<TRaw>(apiFlags, this.createPath, payload)
    const result = this.transformResult(rawResult)

    this.renderAddOutput({flags: outputFlags, result})

    return result
  }

  protected transformResult(result: TRaw): TOutput {
    return result as unknown as TOutput
  }
}
