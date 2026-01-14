import {Args} from '@oclif/core'

import type {Correspondent, CorrespondentCreate} from '../../types/correspondents.js'

import {AddCommand} from '../../add-command.js'

type CorrespondentsAddArgs = {
  name: string
}

export default class CorrespondentsAdd extends AddCommand<CorrespondentCreate, Correspondent> {
  static override args = {
    name: Args.string({description: 'Correspondent name', required: true}),
  }
  static override description = 'Create a correspondent'
  static override examples = ['<%= config.bin %> <%= command.id %> "Acme Corp"']
  protected createPath = '/api/correspondents/'

  protected buildPayload(args: unknown, _flags: Record<string, unknown>): CorrespondentCreate {
    const typedArgs = args as CorrespondentsAddArgs

    return {
      'matching_algorithm': 6,
      name: typedArgs.name,
    }
  }

  protected plainTemplate(correspondent: Correspondent): string | undefined {
    return `[${correspondent.id}] ${correspondent.name}`
  }
}
