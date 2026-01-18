import {Args, Flags} from '@oclif/core'

import type {Correspondent, CorrespondentUpdate} from '../../types/correspondents.js'

import {UpdateCommand} from '../../update-command.js'

type CorrespondentsUpdateFlags = {
  name?: string
}

export default class CorrespondentsUpdate extends UpdateCommand<CorrespondentUpdate, Correspondent> {
  static override args = {
    id: Args.integer({description: 'Correspondent id', required: true}),
  }
  static override description = 'Update a correspondent'
  static override examples = ['<%= config.bin %> <%= command.id %> 123 --name "Acme Corp"']
  static override flags = {
    name: Flags.string({description: 'Correspondent name'}),
  }

  protected buildPayload(_args: unknown, flags: Record<string, unknown>): CorrespondentUpdate {
    const typedFlags = flags as CorrespondentsUpdateFlags

    return {
      name: typedFlags.name,
    }
  }

  protected plainTemplate(correspondent: Correspondent): string | undefined {
    return `[${correspondent.id}] ${correspondent.name}`
  }

  protected updatePath(id: number | string): string {
    return `/api/correspondents/${id}/`
  }
}
