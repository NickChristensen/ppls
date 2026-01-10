import {PaginatedCommand} from '../../paginated-command.js'

type Correspondent = {
  name: string
}

export default class CorrespondentsList extends PaginatedCommand {
  static override description = 'List correspondents'
  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {flags} = await this.parse(CorrespondentsList)
    const pageSize = flags['page-size']
    const url = this.buildPaginatedUrl(flags.hostname, '/api/correspondents/', flags.page, pageSize)
    const autoPaginate = flags.page === undefined && pageSize === undefined

    for await (const correspondent of this.paginate<Correspondent>(url, flags.token, autoPaginate)) {
      if (correspondent.name) {
        this.log(correspondent.name)
      }
    }
  }
}
