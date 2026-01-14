import {Args, Flags} from '@oclif/core'

import type {Tag, TagApi, TagCreate} from '../../types/tags.js'

import {AddCommand} from '../../add-command.js'

type TagsAddArgs = {
  name: string
}

type TagsAddFlags = {
  color?: string
  inbox?: boolean
  parent?: number
}

export default class TagsAdd extends AddCommand<TagCreate, TagApi, Tag> {
  static override args = {
    name: Args.string({description: 'Tag name', required: true}),
  }
  static override description = 'Create a tag'
  static override examples = ['<%= config.bin %> <%= command.id %> Inbox']
  static override flags = {
    color: Flags.string({description: 'Tag color (hex value)'}),
    inbox: Flags.boolean({description: 'Mark tag as an inbox tag'}),
    parent: Flags.integer({description: 'Parent tag id'}),
  }
  protected createPath = '/api/tags/'

  protected buildPayload(args: unknown, flags: Record<string, unknown>): TagCreate {
    const typedArgs = args as TagsAddArgs
    const typedFlags = flags as TagsAddFlags

    return {
      color: typedFlags.color,
      is_inbox_tag: typedFlags.inbox ? true : undefined,
      matching_algorithm: 6,
      name: typedArgs.name,
      parent: typedFlags.parent,
    }
  }

  protected plainTemplate(tag: Tag): string | undefined {
    return `[${tag.id}] ${tag.name}`
  }

  protected transformResult(tag: TagApi): Tag {
    return {
      ...tag,
      children: tag.children.map((child) => child.id),
    }
  }
}
