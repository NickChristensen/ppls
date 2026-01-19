import {Args, Flags} from '@oclif/core'
import {stat, writeFile} from 'node:fs/promises'
import path from 'node:path'

import {BaseCommand} from '../../base-command.js'

type DocumentsDownloadArgs = {
  id: number
}

type DocumentsDownloadFlags = {
  original?: boolean
  output?: string
}

type DownloadResult = {
  bytes: number
  contentType?: string
  filename: string
  id: number
  original: boolean
  output: string
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

export default class DocumentsDownload extends BaseCommand {
  static override args = {
    id: Args.integer({description: 'Document id', required: true}),
  }
  static override description = 'Download a document'
  static override examples = ['<%= config.bin %> <%= command.id %> 123 --output ./document.pdf']
  static override flags = {
    original: Flags.boolean({description: 'Download original file'}),
    output: Flags.string({char: 'o', description: 'Output file path'}),
  }

  public async run(): Promise<DownloadResult> {
    const {args, flags, metadata} = await this.parse()
    const {headers: apiHeaders, hostname, token} = await this.resolveGlobalFlags(flags, metadata)
    const apiFlags = {headers: apiHeaders, hostname, token}
    const typedArgs = args as DocumentsDownloadArgs
    const typedFlags = flags as DocumentsDownloadFlags
    const {data, headers: responseHeaders} = await this.fetchApiBinary(
      apiFlags,
      `/api/documents/${typedArgs.id}/download/`,
      {
      original: typedFlags.original ? 'true' : undefined,
      },
    )
    const contentDisposition = responseHeaders.get('content-disposition')
    const contentType = responseHeaders.get('content-type') ?? undefined
    const headerFilename = parseContentDispositionFilename(contentDisposition)
    const safeFilename = path.basename(
      headerFilename ?? resolveFallbackFilename(typedArgs.id, contentType),
    )
    const outputPath = await resolveOutputPath(typedFlags.output, safeFilename)

    await writeFile(outputPath, data)

    const result: DownloadResult = {
      bytes: data.length,
      contentType,
      filename: path.basename(outputPath),
      id: typedArgs.id,
      original: Boolean(typedFlags.original),
      output: outputPath,
    }

    if (!this.jsonEnabled()) {
      this.log(`Saved ${outputPath}`)
    }

    return result
  }
}
