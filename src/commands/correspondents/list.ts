import {PaginatedCommand} from '../../paginated-command.js'

type Correspondent = {
  name: string
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
      path: '/api/correspondents/',
    })
    const autoPaginate = flags.page === undefined && pageSize === undefined
    const results: Correspondent[] = []

    for await (const correspondent of this.paginate<Correspondent>(url, flags.token, autoPaginate)) {
      results.push(correspondent)

      if (correspondent.name) {
        this.log(correspondent.name)
      }
    }

    return {results}
  }
}
