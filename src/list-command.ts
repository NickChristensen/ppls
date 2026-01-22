import {Flags} from '@oclif/core'

import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'
import {createValueFormatter, type TableColumn, type TableRow} from './helpers/table.js'

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
type PaginatedResponse<T> = {
  next?: null | string
  results?: T[]
}

const DEFAULT_PAGE_SIZE = Number.MAX_SAFE_INTEGER

export abstract class ListCommand<
  TRaw extends TableRow = TableRow,
  TOutput extends TableRow = TRaw,
> extends BaseCommand {
  static baseFlags = {
    ...BaseCommand.baseFlags,
    'id-in': Flags.string({
      description: 'Filter by id list (comma-separated)',
      exclusive: ['name-contains'],
    }),
    'name-contains': Flags.string({
      description: 'Filter by name substring',
      exclusive: ['id-in'],
    }),
    page: Flags.integer({description: 'Page number to fetch'}),
    'page-size': Flags.integer({description: 'Number of results per page'}),
    sort: Flags.string({description: 'Sort results by the provided field'}),
  }
  protected abstract listPath: string
  protected abstract tableAttrs: TableColumnInput[]

  protected buildPaginatedUrl(options: {
    hostname: string
    page?: number
    pageSize?: number
    params?: Record<string, number | string | undefined>
    path: string
  }): URL {
    const {hostname, page, pageSize, params = {}, path} = options
    const resolvedPageSize = pageSize ?? DEFAULT_PAGE_SIZE

    if (page !== undefined && page < 1) {
      this.error('Invalid page value. Page must be 1 or greater.')
    }

    if (resolvedPageSize < 1) {
      this.error('Invalid page size. Page size must be 1 or greater.')
    }

    return this.buildApiUrl(hostname, path, {
      ...params,
      page,
      'page_size': resolvedPageSize,
    })
  }

  protected buildPaginatedUrlFromFlags(options: {
    flags: ListCommandFlags
    params?: Record<string, number | string | undefined>
    path: string
  }): URL {
    const {flags, params, path} = options
    return this.buildPaginatedUrl({
      hostname: flags.hostname,
      page: flags.page,
      pageSize: flags['page-size'],
      params,
      path,
    })
  }

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

  protected async fetchPaginatedResults<T>(options: {
    autoPaginate: boolean
    headers: Record<string, string>
    spinnerText?: string
    token: string
    url: URL
  }): Promise<T[]> {
    const {autoPaginate, headers, spinnerText, token, url} = options
    const spinner = this.startSpinner(spinnerText ?? `Fetching ${url.pathname}`)
    const results: T[] = []

    try {
      let nextUrl: null | URL = url

      while (nextUrl) {
        const currentUrl = nextUrl
        // eslint-disable-next-line no-await-in-loop -- pagination is sequential and depends on the next page URL.
        const payload: PaginatedResponse<T> = await this.fetchJson<PaginatedResponse<T>>(
          currentUrl,
          token,
          headers,
        )
        results.push(...(payload.results ?? []))

        if (!autoPaginate || !payload.next) {
          break
        }

        try {
          const parsedNext = new URL(payload.next, currentUrl)
          nextUrl = this.normalizeNextUrl(parsedNext, currentUrl)
        } catch {
          this.error('API returned an invalid next URL for pagination.')
        }
      }
    } finally {
      spinner?.stop()
    }

    return results
  }

  protected async fetchPaginatedResultsFromFlags<T>(options: {
    autoPaginate: boolean
    flags: {headers: Record<string, string>; token: string}
    spinnerText?: string
    url: URL
  }): Promise<T[]> {
    const {autoPaginate, flags, spinnerText, url} = options
    return this.fetchPaginatedResults<T>({
      autoPaginate,
      headers: flags.headers,
      spinnerText,
      token: flags.token,
      url,
    })
  }

  protected listParams(flags: ListCommandFlags): Record<string, number | string | undefined> {
    return {
      'id__in': flags['id-in'],
      'name__icontains': flags['name-contains'],
    }
  }

  protected normalizeNextUrl(nextUrl: URL, currentUrl: URL): URL {
    if (currentUrl.protocol === 'https:' && nextUrl.protocol === 'http:' && nextUrl.hostname === currentUrl.hostname) {
      nextUrl.protocol = currentUrl.protocol
      if (currentUrl.port) {
        nextUrl.port = currentUrl.port
      }
    }

    return nextUrl
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
