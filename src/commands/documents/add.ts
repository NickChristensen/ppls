import {Args, Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

import type {DocumentCreate} from '../../types/documents.js'

import {BaseCommand} from '../../base-command.js'
import {createValueFormatter, formatField} from '../../helpers/table.js'

type DocumentsAddArgs = {
  path: string
}

type DocumentsAddFlags = {
  'archive-serial-number'?: number
  correspondent?: number
  created?: DocumentCreate['created']
  'document-type'?: number
  'storage-path'?: number
  tag?: number[]
  title?: string
}

type UploadOutputFlags = {
  'date-format': string
  plain?: boolean
  table?: boolean
}

type UploadResult = Record<string, unknown>

export default class DocumentsAdd extends BaseCommand {
  static override args = {
    path: Args.string({description: 'Path to document file', required: true}),
  }
  static override description = 'Upload a document'
  static override examples = ['<%= config.bin %> <%= command.id %> ./receipt.pdf --title "Receipt"']
  static override flags = {
    'archive-serial-number': Flags.integer({description: 'Archive serial number'}),
    correspondent: Flags.integer({description: 'Correspondent id'}),
    created: Flags.string({description: 'Document created date-time'}),
    'document-type': Flags.integer({description: 'Document type id'}),
    'storage-path': Flags.integer({description: 'Storage path id'}),
    tag: Flags.integer({description: 'Tag id (repeatable)', multiple: true}),
    title: Flags.string({description: 'Document title'}),
  }

  protected buildPayload(flags: DocumentsAddFlags): DocumentCreate {
    return {
      'archive_serial_number': flags['archive-serial-number'],
      correspondent: flags.correspondent,
      created: flags.created,
      'document_type': flags['document-type'],
      'storage_path': flags['storage-path'],
      tags: flags.tag,
      title: flags.title,
    }
  }

  protected normalizeResult(result: unknown): UploadResult {
    if (result === null || result === undefined) {
      return {result: null}
    }

    if (typeof result === 'object') {
      return result as UploadResult
    }

    return {result}
  }

  protected plainTemplate(result: UploadResult): string | undefined {
    if (typeof result.result === 'string' && result.result.trim()) {
      return result.result
    }

    if (typeof result.id === 'number' || typeof result.id === 'string') {
      return String(result.id)
    }

    return JSON.stringify(result)
  }

  protected renderUploadOutput(options: {flags: UploadOutputFlags; result: UploadResult}): void {
    if (this.jsonEnabled()) {
      return
    }

    const {flags, result} = options
    const dateFormat = flags['date-format']

    if (flags.plain) {
      const line = this.plainTemplate(result)

      if (line) {
        this.log(line)
      }

      return
    }

    const valueFormatter = createValueFormatter(dateFormat)
    const rows = Object.entries(result).map(([field, value]) => ({field, value}))

    this.logTable(
      [
        {align: 'right', formatter: formatField, value: 'field'},
        {formatter: valueFormatter, value: 'value'},
      ],
      rows,
      {showHeader: false},
    )
  }

  public async run(): Promise<UploadResult> {
    const {args, flags, metadata} = await this.parse()
    const {dateFormat, ...apiFlags} = await this.resolveGlobalFlags(flags, metadata)
    const outputFlags: UploadOutputFlags = {
      'date-format': dateFormat,
      plain: flags.plain,
      table: flags.table,
    }
    const typedArgs = args as DocumentsAddArgs
    const typedFlags = flags as DocumentsAddFlags
    const payload = this.buildPayload(typedFlags)
    let fileContents: Buffer

    try {
      fileContents = await readFile(typedArgs.path)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(`Failed to read file at ${typedArgs.path}: ${message}`)
    }

    const formData = new FormData()
    const filename = path.basename(typedArgs.path)
    const arrayBuffer = fileContents.buffer.slice(
      fileContents.byteOffset,
      fileContents.byteOffset + fileContents.byteLength,
    ) as ArrayBuffer
    formData.set('document', new Blob([arrayBuffer]), filename)

    if (payload.title !== undefined) {
      formData.set('title', payload.title)
    }

    if (payload.correspondent !== undefined) {
      formData.set('correspondent', String(payload.correspondent))
    }

    if (payload.document_type !== undefined) {
      formData.set('document_type', String(payload.document_type))
    }

    if (payload.storage_path !== undefined) {
      formData.set('storage_path', String(payload.storage_path))
    }

    if (payload.created !== undefined) {
      formData.set('created', payload.created)
    }

    if (payload.archive_serial_number !== undefined) {
      formData.set('archive_serial_number', String(payload.archive_serial_number))
    }

    if (payload.tags && payload.tags.length > 0) {
      for (const tag of payload.tags) {
        formData.append('tags', String(tag))
      }
    }

    const rawResult = await this.postApiFormData<unknown>(apiFlags, '/api/documents/post_document/', formData)
    const result = this.normalizeResult(rawResult)

    this.renderUploadOutput({flags: outputFlags, result})

    return result
  }
}
