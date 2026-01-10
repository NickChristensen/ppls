import {PaginatedCommand} from './paginated-command.js'
import {formatValue, type TableColumn, type TableRow} from './table.js'

type ListCommandFlags = {
  hostname: string
  page?: number
  'page-size'?: number
  sort?: string
  token: string
}

type ListOutputFlags = ListCommandFlags & {
  plain?: boolean
  table?: boolean
}

type TableColumnInput = string | TableColumn

export abstract class ListCommand<T extends TableRow = TableRow> extends PaginatedCommand {
  protected abstract listPath: string
  protected abstract tableAttrs: TableColumnInput[]

  protected async fetchListResults<T>(options: {
    flags: ListCommandFlags
    params?: Record<string, number | string | undefined>
    path: string
  }): Promise<T[]> {
    const {flags, params = {}, path} = options
    const pageSize = flags['page-size']
    const url = this.buildPaginatedUrl({
      hostname: flags.hostname,
      page: flags.page,
      pageSize,
      params: {
        ordering: flags.sort,
        ...params,
      },
      path,
    })

    return this.fetchPaginatedResults<T>({
      autoPaginate: this.shouldAutoPaginate(flags),
      token: flags.token,
      url,
    })
  }

  protected listParams(_flags: ListCommandFlags): Record<string, number | string | undefined> {
    return {}
  }

  protected abstract plainTemplate(item: T): null | string | undefined

  protected renderListOutput(options: {flags: ListOutputFlags; results: T[]}): void {
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

  public async run(): Promise<T[]> {
    const {flags} = await this.parse()
    const listFlags: ListCommandFlags = {
      hostname: flags.hostname,
      page: flags.page,
      'page-size': flags['page-size'],
      sort: flags.sort,
      token: flags.token,
    }
    const outputFlags: ListOutputFlags = {
      ...listFlags,
      plain: flags.plain,
      table: flags.table,
    }
    const results = await this.fetchListResults<T>({
      flags: listFlags,
      params: this.listParams(listFlags),
      path: this.listPath,
    })

    this.renderListOutput({
      flags: outputFlags,
      results,
    })

    return results
  }

  protected shouldAutoPaginate(flags: ListCommandFlags): boolean {
    return flags.page === undefined && flags['page-size'] === undefined
  }
}
