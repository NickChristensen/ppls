import {PaginatedCommand} from '../../paginated-command.js'

type Correspondent = {
  document_count?: number
  id?: number
  name: string
  slug?: string
}

export default class CorrespondentsList extends PaginatedCommand {
  static override description = 'List correspondents'
  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<{results: Correspondent[]}> {
    const {flags} = await this.parse(CorrespondentsList)
    const pageSize = flags['page-size']
    const url = this.buildPaginatedUrl({
      hostname: flags.hostname,
      page: flags.page,
      pageSize,
      params: {
        ordering: flags.sort,
      },
      path: '/api/correspondents/',
    })
    const autoPaginate = flags.page === undefined && pageSize === undefined
    const results = await this.fetchPaginatedResults<Correspondent>({
      autoPaginate,
      token: flags.token,
      url,
    })

    if (flags.plain) {
      for (const correspondent of results) {
        if (!correspondent.name) {
          continue
        }

        const count = correspondent.document_count
        const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

        this.log(`[${correspondent.id}] ${correspondent.name}${suffix}`)
      }
    } else {
      this.logTable([{value: 'id'}, {value: 'name'}, {value: 'slug'}, {value: 'document_count'}], results)
    }

    return {results}
  }
}
