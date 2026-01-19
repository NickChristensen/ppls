import {Args, Flags} from '@oclif/core'

import type {Document, DocumentUpdate} from '../../types/documents.js'

import {UpdateCommand} from '../../update-command.js'

type DocumentsUpdateFlags = {
  'archive-serial-number'?: number
  content?: string
  correspondent?: number
  created?: DocumentUpdate['created']
  'document-type'?: number
  'storage-path'?: number
  tag?: number[]
  title?: string
}

export default class DocumentsUpdate extends UpdateCommand<DocumentUpdate, Document> {
  static override args = {
    id: Args.integer({description: 'Document id', required: true}),
  }
  static override description = 'Update a document'
  static override examples = ['<%= config.bin %> <%= command.id %> 123 --title "Receipt"']
  static override flags = {
    'archive-serial-number': Flags.integer({description: 'Archive serial number'}),
    content: Flags.string({description: 'Document content'}),
    correspondent: Flags.integer({description: 'Correspondent id'}),
    created: Flags.string({description: 'Document created date'}),
    'document-type': Flags.integer({description: 'Document type id'}),
    'storage-path': Flags.integer({description: 'Storage path id'}),
    tag: Flags.integer({description: 'Tag id (repeatable)', multiple: true}),
    title: Flags.string({description: 'Document title'}),
  }

  protected buildPayload(_args: unknown, flags: Record<string, unknown>): DocumentUpdate {
    const typedFlags = flags as DocumentsUpdateFlags

    return {
      'archive_serial_number': typedFlags['archive-serial-number'],
      content: typedFlags.content,
      correspondent: typedFlags.correspondent,
      created: typedFlags.created,
      'document_type': typedFlags['document-type'],
      'storage_path': typedFlags['storage-path'],
      tags: typedFlags.tag,
      title: typedFlags.title,
    }
  }

  protected plainTemplate(document: Document): string | undefined {
    const title = document.title?.trim()
    if (!title) {
      return
    }

    return `[${document.id}] ${title}`
  }

  protected updatePath(id: number | string): string {
    return `/api/documents/${id}/`
  }
}
