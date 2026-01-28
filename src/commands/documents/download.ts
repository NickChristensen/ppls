import {Args, Flags} from '@oclif/core'
import {stat, writeFile} from 'node:fs/promises'
import path from 'node:path'

import {BaseCommand} from '../../base-command.js'

type DocumentsDownloadFlags = {
  original?: boolean
  output?: string
  'output-dir'?: string
}

type DownloadResult = {
  bytes: number
  contentType?: string
  filename: string
  id: number
  original: boolean
  output: string
}

type DownloadDocumentOptions = {
  apiFlags: {headers: Record<string, string>; hostname: string; token: string}
  id: number
  original?: boolean
  output?: string
  outputDir?: string
}

type DownloadDocumentsOptions = {
  apiFlags: {headers: Record<string, string>; hostname: string; token: string}
  ids: number[]
  original?: boolean
  output?: string
  outputDir?: string
}

const parseContentDispositionFilename = (header: null | string): string | undefined => {
  if (!header) {
    return
  }

  const starMatch = /filename\*=([^']*)''([^;]+)/i.exec(header)
  if (starMatch?.[2]) {
    try {
      return decodeURIComponent(starMatch[2])
    } catch {
      return starMatch[2]
    }
  }

  const match = /filename="?([^";]+)"?/i.exec(header)
  return match?.[1]
}

const resolveFallbackFilename = (id: number, contentType: string | undefined): string => {
  if (contentType?.includes('pdf')) {
    return `document-${id}.pdf`
  }

  return `document-${id}`
}

const resolveOutputPath = async (output: string | undefined, filename: string): Promise<string> => {
  if (!output) {
    return path.resolve(process.cwd(), filename)
  }

  const resolved = path.resolve(output)

  try {
    const stats = await stat(resolved)
    if (stats.isDirectory()) {
      return path.join(resolved, filename)
    }
  } catch {
    // Assume output is a file path if it doesn't exist yet.
  }

  return resolved
}

const splitDelimitedValues = (input: string, delimiter: string): string[] => {
  const splitRegex = new RegExp(`(?<!\\\\)${delimiter}`)

  return input
    .split(splitRegex)
    .map((value) => value.trim())
    .map((value) =>
      value
        .replaceAll(new RegExp(`\\\\${delimiter}`, 'g'), delimiter)
        .replace(/^"(.*)"$/, '$1')
        .replace(/^'(.*)'$/, '$1'),
    )
    .filter((value) => value.length > 0)
}

export default class DocumentsDownload extends BaseCommand {
  static override strict = false
  static override args = {
    id: Args.string({description: 'Document id (repeatable or comma-separated)'}),
  }
  static override description = 'Download one or more documents'
  static override examples = [
    '<%= config.bin %> <%= command.id %> --output document.pdf 123',
    '<%= config.bin %> <%= command.id %> --output-dir ./downloads 123 456',
    '<%= config.bin %> <%= command.id %> --output-dir ./downloads 123,456',
  ]
  static override flags = {
    original: Flags.boolean({description: 'Download original file'}),
    output: Flags.string({
      char: 'o',
      description: 'Output file path (single document)',
      exclusive: ['output-dir'],
    }),
    'output-dir': Flags.directory({
      description: 'Output directory (multiple documents)',
      exclusive: ['output'],
      exists: true,
    }),
  }

  protected async downloadDocument(options: DownloadDocumentOptions): Promise<DownloadResult> {
    const {apiFlags, id, original, output, outputDir} = options
    const {data, headers: responseHeaders} = await this.fetchApiBinary(apiFlags, `/api/documents/${id}/download/`, {
      original: original ? 'true' : undefined,
    })
    const contentDisposition = responseHeaders.get('content-disposition')
    const contentType = responseHeaders.get('content-type') ?? undefined
    const headerFilename = parseContentDispositionFilename(contentDisposition)
    const safeFilename = path.basename(headerFilename ?? resolveFallbackFilename(id, contentType))
    const outputPath = outputDir ? path.join(outputDir, safeFilename) : await resolveOutputPath(output, safeFilename)

    await writeFile(outputPath, data)

    return {
      bytes: data.length,
      contentType,
      filename: path.basename(outputPath),
      id,
      original: Boolean(original),
      output: outputPath,
    }
  }

  protected async downloadDocuments(options: DownloadDocumentsOptions): Promise<DownloadResult[]> {
    const {apiFlags, ids, original, output, outputDir} = options
    const results: DownloadResult[] = []
    const spinner = this.startSpinner('')

    try {
      for (let index = 0; index < ids.length; index += 1) {
        const id = ids[index]
        const prefix = ids.length > 1 ? `[${index + 1}/${ids.length}] ` : ''

        if (spinner) {
          spinner.text = `${prefix}Downloading document ${id}`
        }

        // eslint-disable-next-line no-await-in-loop -- downloads are sequential to keep spinner output in order.
        const result = await this.downloadDocument({apiFlags, id, original, output, outputDir})
        results.push(result)
      }
    } finally {
      spinner?.stop()
    }

    return results
  }

  public async run(): Promise<DownloadResult | DownloadResult[]> {
    const {flags, metadata, raw} = await this.parse()
    const {headers: apiHeaders, hostname, token} = await this.resolveGlobalFlags(flags, metadata)
    const apiFlags = {headers: apiHeaders, hostname, token}
    const typedFlags = flags as DocumentsDownloadFlags
    const rawArgs = raw.filter((token) => token.type === 'arg').map((token) => token.input)
    const values = rawArgs.flatMap((value) => splitDelimitedValues(value, ','))

    if (values.length === 0) {
      this.error('Provide at least one document id.')
    }

    const ids = values.map((value) => {
      if (!/^-?\d+$/.test(value)) {
        this.error(`Invalid document id: ${value}`)
      }

      return Number.parseInt(value, 10)
    })
    let outputDir = typedFlags['output-dir']

    if (ids.length > 1) {
      if (typedFlags.output) {
        this.error('Use --output-dir when downloading multiple documents.')
      }

      outputDir = path.resolve(outputDir ?? process.cwd())
    } else if (outputDir) {
      this.error('Use --output for a single document download.')
    }

    const results = await this.downloadDocuments({
      apiFlags,
      ids,
      original: typedFlags.original,
      output: typedFlags.output,
      outputDir,
    })

    if (!this.jsonEnabled()) {
      for (const result of results) {
        this.log(`Saved ${result.output}`)
      }
    }

    return results.length === 1 ? results[0] : results
  }
}
