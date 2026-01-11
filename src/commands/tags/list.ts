import type {Tag, TagApi} from '../../types/tags.js'

import {ListCommand} from '../../list-command.js'

export default class TagsList extends ListCommand<TagApi, Tag> {
  static override description = 'List tags'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  protected listPath = '/api/tags/'
  protected tableAttrs = ['id', 'name', 'slug', 'document_count']

  protected plainTemplate(tag: Tag): string | undefined {
    const count = tag.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${tag.id}] ${tag.name}${suffix}`
  }

  protected transformResult(tag: TagApi): Tag {
    return {
      ...tag,
      children: tag.children.map((child) => child.id),
    }
  }
}
