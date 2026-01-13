import {Flags} from '@oclif/core'

import type {ApiFlags} from './base-command.js'

import {createValueFormatter, type TableColumn, type TableRow} from './helpers/table.js'
import {PaginatedCommand} from './paginated-command.js'

type ListCommandFlags = ApiFlags & {
  'id-in'?: string
  'name-contains'?: string
  page?: number
  'page-size'?: number
  sort?: string
}

type ListOutputFlags = ListCommandFlags & {
  'date-format': string
  plain?: boolean
  table?: boolean
}

type TableColumnInput = string | TableColumn

export abstract class ListCommand<
  TRaw extends TableRow = TableRow,
  TOutput extends TableRow = TRaw,
> extends PaginatedCommand {
  static baseFlags = {
    ...PaginatedCommand.baseFlags,
    'id-in': Flags.string({
      description: 'Filter by id list (comma-separated)',
      exclusive: ['name-contains'],
    }),
    'name-contains': Flags.string({
      description: 'Filter by name substring',
      exclusive: ['id-in'],
    }),
  }
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

  protected listParams(flags: ListCommandFlags): Record<string, number | string | undefined> {
    return {
      'id__in': flags['id-in'],
      'name__icontains': flags['name-contains'],
    }
  }

  protected abstract plainTemplate(item: TOutput): null | string | undefined

  protected renderListOutput(options: {flags: ListOutputFlags; results: TOutput[]}): void {
    if (this.jsonEnabled()) {
      return
    }

    const {flags, results} = options
    const dateFormat = flags['date-format'] as string

    if (flags.plain) {
      for (const item of results) {
        const line = this.plainTemplate(item)

        if (line) {
          this.log(line)
        }
      }

      return
    }

    const valueFormatter = createValueFormatter(dateFormat)
    const columns: TableColumn[] = this.tableAttrs.map((value) =>
      typeof value === 'string' ? {formatter: valueFormatter, value} : {formatter: valueFormatter, ...value},
    )

    this.logTable(columns, results)
  }

  public async run(): Promise<TOutput[]> {
    const {flags, metadata} = await this.parse()
    const apiFlags = await this.resolveApiFlags(flags)
    const dateFormat = await this.resolveDateFormat(flags, metadata)
    const listFlags: ListCommandFlags = {
      headers: apiFlags.headers,
      hostname: apiFlags.hostname,
      'id-in': flags['id-in'],
      'name-contains': flags['name-contains'],
      page: flags.page,
      'page-size': flags['page-size'],
      sort: flags.sort,
      token: apiFlags.token,
    }
    const outputFlags: ListOutputFlags = {
      ...listFlags,
      'date-format': dateFormat,
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
