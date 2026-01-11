import type {ApiFlags} from './base-command.js'

import {PaginatedCommand} from './paginated-command.js'
import {formatValue, type TableColumn, type TableRow} from './table.js'

type ListCommandFlags = ApiFlags & {
  page?: number
  'page-size'?: number
  sort?: string
}

type ListOutputFlags = ListCommandFlags & {
  plain?: boolean
  table?: boolean
}

type TableColumnInput = string | TableColumn

export abstract class ListCommand<
  TRaw extends TableRow = TableRow,
  TOutput extends TableRow = TRaw,
> extends PaginatedCommand {
  protected abstract listPath: string
  protected abstract tableAttrs: TableColumnInput[]

  protected async fetchListResults<T>(options: {
    flags: ListCommandFlags
    params?: Record<string, number | string | undefined>
    path: string
  }): Promise<T[]> {
    const {flags, params = {}, path} = options
    const url = this.buildPaginatedUrlFromFlags({
      flags,
      params: {
        ordering: flags.sort,
        ...params,
      },
      path,
    })

    return this.fetchPaginatedResultsFromFlags<T>({
      autoPaginate: this.shouldAutoPaginate(flags),
      flags,
      url,
    })
  }

  protected listParams(_flags: ListCommandFlags): Record<string, number | string | undefined> {
    return {}
  }

  protected abstract plainTemplate(item: TOutput): null | string | undefined

  protected renderListOutput(options: {flags: ListOutputFlags; results: TOutput[]}): void {
    if (this.jsonEnabled()) {
      return
    }

    const {flags, results} = options

    if (flags.plain) {
      for (const item of results) {
        const line = this.plainTemplate(item)

        if (line) {
          this.log(line)
        }
      }

      return
    }

    const columns: TableColumn[] = this.tableAttrs.map((value) =>
      typeof value === 'string' ? {formatter: formatValue, value} : {formatter: formatValue, ...value},
    )

    this.logTable(columns, results)
  }

  public async run(): Promise<TOutput[]> {
    const {flags} = await this.parse()
    const apiFlags = await this.resolveApiFlags(flags)
    const listFlags: ListCommandFlags = {
      hostname: apiFlags.hostname,
      page: flags.page,
      'page-size': flags['page-size'],
      sort: flags.sort,
      token: apiFlags.token,
    }
    const outputFlags: ListOutputFlags = {
      ...listFlags,
      plain: flags.plain,
      table: flags.table,
    }
    const rawResults = await this.fetchListResults<TRaw>({
      flags: listFlags,
      params: this.listParams(listFlags),
      path: this.listPath,
    })
    const results = this.transformResults(rawResults)

    this.renderListOutput({
      flags: outputFlags,
      results,
    })

    return results
  }

  protected shouldAutoPaginate(flags: ListCommandFlags): boolean {
    return flags.page === undefined && flags['page-size'] === undefined
  }

  protected transformResult(result: TRaw): TOutput {
    return result as unknown as TOutput
  }

  protected transformResults(results: TRaw[]): TOutput[] {
    return results.map((result) => this.transformResult(result))
  }
}
