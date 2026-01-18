import {Args, Flags} from '@oclif/core'

import type {Tag, TagUpdate} from '../../types/tags.js'

import {UpdateCommand} from '../../update-command.js'

type TagsUpdateFlags = {
  color?: string
  inbox?: boolean
  name?: string
  parent?: number
}

export default class TagsUpdate extends UpdateCommand<TagUpdate, Tag> {
  static override args = {
    id: Args.integer({description: 'Tag id', required: true}),
  }
  static override description = 'Update a tag'
  static override examples = ['<%= config.bin %> <%= command.id %> 123 --name Inbox']
  static override flags = {
    color: Flags.string({description: 'Tag color (hex value)'}),
    inbox: Flags.boolean({allowNo: true, description: 'Mark tag as an inbox tag'}),
    name: Flags.string({description: 'Tag name'}),
    parent: Flags.integer({description: 'Parent tag id'}),
  }

  protected buildPayload(_args: unknown, flags: Record<string, unknown>): TagUpdate {
    const typedFlags = flags as TagsUpdateFlags

    return {
      color: typedFlags.color,
      'is_inbox_tag': typedFlags.inbox,
      name: typedFlags.name,
      parent: typedFlags.parent,
    }
  }

  protected plainTemplate(tag: Tag): string | undefined {
    return `[${tag.id}] ${tag.name}`
  }

  protected updatePath(id: number | string): string {
    return `/api/tags/${id}/`
  }
}
