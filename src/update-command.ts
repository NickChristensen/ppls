import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'
import {createValueFormatter, formatField} from './helpers/table.js'

type UpdateCommandArgs = {
  id: number | string
}

type UpdateCommandFlags = ApiFlags & {
  'date-format': string
  plain?: boolean
  table?: boolean
}

type UpdateTableRow = {
  field: string
  value: unknown
}

export abstract class UpdateCommand<
  TUpdate = Record<string, unknown>,
  TRaw extends Record<string, unknown> = Record<string, unknown>,
  TOutput extends Record<string, unknown> = TRaw,
> extends BaseCommand {
  protected abstract buildPayload(args: unknown, flags: Record<string, unknown>): TUpdate
  protected abstract plainTemplate(item: TOutput): null | string | undefined

  protected renderUpdateOutput(options: {flags: UpdateCommandFlags; result: TOutput}): void {
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
      this.updateRows(result),
      {showHeader: false},
    )
  }

  public async run(): Promise<TOutput> {
    const {args, flags, metadata} = await this.parse()
    const {dateFormat, ...apiFlags} = await this.resolveGlobalFlags(flags, metadata)
    const outputFlags: UpdateCommandFlags = {
      ...apiFlags,
      'date-format': dateFormat,
      plain: flags.plain,
      table: flags.table,
    }
    const payload = this.buildPayload(args, flags)
    const id = this.updateId(args as UpdateCommandArgs)
    const rawResult = await this.patchApiJson<TRaw>(apiFlags, this.updatePath(id), payload)
    const result = this.transformResult(rawResult)

    this.renderUpdateOutput({flags: outputFlags, result})

    return result
  }

  protected transformResult(result: TRaw): TOutput {
    return result as unknown as TOutput
  }

  protected updateId(args: UpdateCommandArgs): number | string {
    return args.id
  }

  protected abstract updatePath(id: number | string): string

  protected updateRows(result: TOutput): UpdateTableRow[] {
    return Object.entries(result).map(([field, value]) => ({
      field,
      value,
    }))
  }
}
