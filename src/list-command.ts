import {Flags} from '@oclif/core'

import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'
import {createValueFormatter, type TableColumn, type TableRow} from './helpers/table.js'

type ListCommandFlags = ApiFlags & {
  'id-in'?: string[]
  'name-contains'?: string
  page?: number
  'page-size': number
  sort?: string
}

type ListOutputFlags = ListCommandFlags & {
  'date-format': string
  plain?: boolean
  table?: boolean
}

type TableColumnInput = string | TableColumn

type PaginatedResponse<T> = {
  results?: T[]
}

export abstract class ListCommand<
  TRaw extends TableRow = TableRow,
  TOutput extends TableRow = TRaw,
> extends BaseCommand {
  static baseFlags = {
    ...BaseCommand.baseFlags,
    'id-in': Flags.string({
      delimiter: ',',
      description: 'Filter by id list (repeatable or comma-separated)',
      exclusive: ['name-contains'],
      helpGroup: 'FILTER',
      multiple: true,
    }),
    'name-contains': Flags.string({
      description: 'Filter by name substring',
      exclusive: ['id-in'],
      helpGroup: 'FILTER',
    }),
    page: Flags.integer({
      dependsOn: ['page-size'],
      description: 'Page number to fetch',
      min: 1,
    }),
    'page-size': Flags.integer({
      default: async ({flags}) => (flags.page === undefined ? Number.MAX_SAFE_INTEGER : undefined),
      defaultHelp: async () => 'disable pagination, all results',
      description: 'Number of results per page',
      min: 1,
    }),
    sort: Flags.string({description: 'Sort results by the provided field'}),
  }
  protected abstract listPath: string
  protected abstract tableAttrs: TableColumnInput[]

  protected extraListFlags(_flags: Record<string, unknown>): Record<string, unknown> {
    return {}
  }

  protected async fetchListResults<T>(options: {
    flags: ListCommandFlags
    params?: Record<string, number | number[] | string | string[] | undefined>
    path: string
  }): Promise<T[]> {
    const {flags, params = {}, path} = options
    const url = this.buildListUrl({
      flags,
      params: {
        ordering: flags.sort,
        ...params,
      },
      path,
    })
    const spinner = this.startSpinner(`Fetching ${url.pathname}`)

    try {
      const payload = await this.fetchJson<PaginatedResponse<T>>(url, flags.token, flags.headers)
      return payload.results ?? []
    } finally {
      spinner?.stop()
    }
  }

  protected listParams(flags: ListCommandFlags): Record<string, number | number[] | string | string[] | undefined> {
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
    const {dateFormat, ...apiFlags} = await this.resolveGlobalFlags(flags, metadata)

    const listFlags: ListCommandFlags & Record<string, unknown> = {
      headers: apiFlags.headers,
      hostname: apiFlags.hostname,
      'id-in': flags['id-in'],
      'name-contains': flags['name-contains'],
      page: flags.page,
      'page-size': flags['page-size'],
      sort: flags.sort,
      token: apiFlags.token,
      ...this.extraListFlags(flags),
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

  protected transformResult(result: TRaw): TOutput {
    return result as unknown as TOutput
  }

  protected transformResults(results: TRaw[]): TOutput[] {
    return results.map((result) => this.transformResult(result))
  }

  private buildListUrl(options: {
    flags: ListCommandFlags
    params?: Record<string, number | number[] | string | string[] | undefined>
    path: string
  }): URL {
    const {flags, params = {}, path} = options
    const {page} = flags
    const pageSize = flags['page-size']

    return this.buildApiUrl(flags.hostname, path, {
      ...params,
      page,
      'page_size': pageSize,
    })
  }
}
