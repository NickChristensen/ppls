import {Args, Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

import type {DocumentCreate} from '../../types/documents.js'

import {BaseCommand} from '../../base-command.js'
import {createValueFormatter, formatField} from '../../helpers/table.js'

type DocumentsAddArgs = {
  path?: string
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

type UploadFileOptions = {
  apiFlags: {headers: Record<string, string>; hostname: string; token: string}
  filePath: string
  payload: DocumentCreate
}

export default class DocumentsAdd extends BaseCommand {
  static override args = {
    path: Args.file({description: 'Document file path(s)'}),
  }
  static override description = 'Upload one or more documents. Supports multiple arguments or a glob.'
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
  static override strict = false

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

  protected buildUploadFormData(payload: DocumentCreate, filename: string, fileContents: Buffer): FormData {
    const formData = new FormData()
    const arrayBuffer = fileContents.buffer.slice(
      fileContents.byteOffset,
      fileContents.byteOffset + fileContents.byteLength,
    ) as ArrayBuffer
    formData.set('document', new Blob([arrayBuffer]), filename)

    const fields: Array<[string, string | undefined]> = [
      ['title', payload.title],
      ['correspondent', this.toOptionalString(payload.correspondent)],
      ['document_type', this.toOptionalString(payload.document_type)],
      ['storage_path', this.toOptionalString(payload.storage_path)],
      ['created', payload.created],
      ['archive_serial_number', this.toOptionalString(payload.archive_serial_number)],
    ]

    for (const [field, value] of fields) {
      if (value === undefined) {
        continue
      }

      formData.set(field, value)
    }

    if (payload.tags && payload.tags.length > 0) {
      for (const tag of payload.tags) {
        formData.append('tags', String(tag))
      }
    }

    return formData
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

  protected resolveUploadPaths(args: DocumentsAddArgs, argv: unknown[]): string[] {
    const rawPaths = argv.length > 0 ? (argv as string[]) : args.path ? [args.path] : []

    if (rawPaths.length === 0) {
      this.error('Provide at least one file path to upload.')
    }

    return rawPaths.map(String)
  }

  public async run(): Promise<UploadResult | UploadResult[]> {
    const {args, argv, flags, metadata} = await this.parse()
    const {dateFormat, ...apiFlags} = await this.resolveGlobalFlags(flags, metadata)
    const outputFlags: UploadOutputFlags = {
      'date-format': dateFormat,
      plain: flags.plain,
      table: flags.table,
    }
    const typedArgs = args as DocumentsAddArgs
    const typedFlags = flags as DocumentsAddFlags
    const paths = this.resolveUploadPaths(typedArgs, argv)
    const payload = this.buildPayload(typedFlags)
    const results = await this.uploadFiles({apiFlags, paths, payload})

    if (!this.jsonEnabled()) {
      for (const result of results) {
        this.renderUploadOutput({flags: outputFlags, result})
      }
    }

    return results.length === 1 ? results[0] : results
  }

  protected toOptionalString(value: null | number | undefined): string | undefined {
    if (value === null || value === undefined) {
      return
    }

    return String(value)
  }

  protected async uploadFile(options: UploadFileOptions): Promise<UploadResult> {
    const {apiFlags, filePath, payload} = options
    let fileContents: Buffer

    try {
      fileContents = await readFile(filePath)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(`Failed to read file at ${filePath}: ${message}`)
    }

    const filename = path.basename(filePath)
    const formData = this.buildUploadFormData(payload, filename, fileContents)
    const rawResult = await this.postApiFormData<unknown>(apiFlags, '/api/documents/post_document/', formData)

    return this.normalizeResult(rawResult)
  }

  protected async uploadFiles(options: {
    apiFlags: {headers: Record<string, string>; hostname: string; token: string}
    paths: string[]
    payload: DocumentCreate
  }): Promise<UploadResult[]> {
    const {apiFlags, paths, payload} = options
    const results: UploadResult[] = []
    const spinner = this.startSpinner('')

    try {
      for (let index = 0; index < paths.length; index += 1) {
        const filePath = paths[index]
        const filename = path.basename(filePath)
        const prefix = paths.length > 1 ? `[${index + 1}/${paths.length}] ` : ''

        if (spinner) {
          spinner.text = `${prefix}Uploading ${filename}`
        }

        // eslint-disable-next-line no-await-in-loop -- uploads are sequential to keep spinner output in order.
        const result = await this.uploadFile({apiFlags, filePath, payload})
        results.push(result)
      }
    } finally {
      spinner?.stop()
    }

    return results
  }
}
