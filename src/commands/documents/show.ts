import {Args} from '@oclif/core'

import type {Document} from '../../types/documents.js'

import {ShowCommand} from '../../show-command.js'

export default class DocumentsShow extends ShowCommand<Document> {
  static override args = {
    id: Args.integer({description: 'Document id', required: true}),
  }
  static override description = 'Show document details'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']

  protected plainTemplate(document: Document): string | undefined {
    const title = document.title?.trim()
    if (!title) {
      return
    }

    return `[${document.id}] ${title}`
  }

  protected showPath(id: number | string): string {
    return `/api/documents/${id}/`
  }
}
