import {Args} from '@oclif/core'

import type {Tag, TagApi} from '../../types/tags.js'

import {ShowCommand} from '../../show-command.js'

export const isHexColor = (value: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(value)

export default class TagsShow extends ShowCommand<TagApi, Tag> {
  static override args = {
    id: Args.integer({description: 'Tag id', required: true}),
  }
  static override description = 'Show tag details'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']

  protected plainTemplate(tag: Tag): string | undefined {
    const count = tag.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${tag.id}] ${tag.name}${suffix}`
  }

  protected showPath(id: number | string): string {
    return `/api/tags/${id}/`
  }

  protected transformResult(tag: TagApi): Tag {
    return {
      ...tag,
      children: tag.children.map((child) => child.id),
    }
  }
}
