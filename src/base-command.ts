import {Command, Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import yoctoSpinner from 'yocto-spinner'

import {renderTable, type TableColumn, type TableOptions, type TableRow} from './helpers/table.js'

export type ApiFlags = {
  headers: Record<string, string>
  hostname: string
  token: string
}

type ResolvedGlobalFlags = ApiFlags & {
  dateFormat: string
}

type UserConfig = Partial<ApiFlags> & {
  'date-format'?: string
  dateFormat?: string
  header?: string | string[]
  headers?: Record<string, unknown> | string | string[]
}

type CommandMetadata = {
  flags?: Record<string, {setFromDefault?: boolean}>
}

export abstract class BaseCommand extends Command {
  static baseFlags = {
    'date-format': Flags.string({
      default: 'yyyy-MM-dd',
      description: 'Format output dates using a template.',
      env: 'PPLS_DATE_FORMAT',
      helpGroup: 'GLOBAL',
    }),
    header: Flags.string({
      description: 'Add a custom request header (repeatable, format: Key=Value)',
      env: 'PPLS_HEADERS',
      helpGroup: 'ENVIRONMENT',
      multiple: true,
    }),
    hostname: Flags.string({
      description: 'Paperless-ngx base URL',
      env: 'PPLS_HOSTNAME',
      helpGroup: 'ENVIRONMENT',
    }),
    plain: Flags.boolean({
      description: 'Format output as plain text.',
      exclusive: ['json', 'table'],
      helpGroup: 'GLOBAL',
    }),
    sort: Flags.string({description: 'Sort results by the provided field'}),
    table: Flags.boolean({
      description: 'Format output as table.',
      exclusive: ['json', 'plain'],
      helpGroup: 'GLOBAL',
    }),
    token: Flags.string({
      description: 'Paperless-ngx API token',
      env: 'PPLS_TOKEN',
      helpGroup: 'ENVIRONMENT',
    }),
  }
  static enableJsonFlag = true
  private userConfigPromise?: Promise<UserConfig>

  protected buildApiUrl(
    hostnameValue: string,
    path: string,
    params: Record<string, number | string | undefined> = {},
  ): URL {
    let url: URL

    try {
      url = new URL(path, new URL(hostnameValue))
    } catch {
      this.error('Invalid hostname. Expected a full URL like https://paperless.example.com')
    }

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }

    return url
  }

  protected buildApiUrlFromFlags(
    flags: ApiFlags,
    path: string,
    params: Record<string, number | string | undefined> = {},
  ): URL {
    return this.buildApiUrl(flags.hostname, path, params)
  }

  protected async deleteApiJson<T>(flags: ApiFlags, path: string): Promise<null | T> {
    const url = this.buildApiUrlFromFlags(flags, path)
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Token ${flags.token}`,
      ...flags.headers,
    }
    const response = await fetch(url, {
      headers: requestHeaders,
      method: 'DELETE',
    })

    if (!response.ok) {
      this.error(await this.formatErrorMessage(response))
    }

    const contentType = response.headers.get('content-type') ?? ''
    const payloadText = await response.text()

    if (!payloadText.trim()) {
      return null
    }

    if (contentType.includes('application/json')) {
      return JSON.parse(payloadText) as T
    }

    return payloadText as T
  }

  protected async fetchApiJson<T>(
    flags: ApiFlags,
    path: string,
    params: Record<string, number | string | undefined> = {},
  ): Promise<T> {
    const url = this.buildApiUrlFromFlags(flags, path, params)
    return this.fetchJson<T>(url, flags.token, flags.headers)
  }

  protected async fetchJson<T>(url: URL, tokenValue: string, headers: Record<string, string> = {}): Promise<T> {
    return this.requestJson<T>({
      headers,
      method: 'GET',
      token: tokenValue,
      url,
    })
  }

  protected async formatErrorMessage(response: Response): Promise<string> {
    const baseMessage = `Request failed with ${response.status} ${response.statusText}`.trim()

    if (response.status >= 400 && response.status < 600) {
      try {
        const payloadText = await response.clone().text()

        if (payloadText) {
          const payload = JSON.parse(payloadText) as {error?: unknown}

          if (typeof payload?.error === 'string' && payload.error.trim()) {
            return `${payload.error}`
          }
        }
      } catch {
        // Fall back to generic error when response isn't JSON.
      }
    }

    return baseMessage
  }

  protected async loadUserConfig(): Promise<UserConfig> {
    if (this.userConfigPromise) {
      return this.userConfigPromise
    }

    const configPath = path.join(this.config.configDir, 'config.json')

    this.userConfigPromise = (async () => {
      try {
        const rawConfig = await readFile(configPath, 'utf8')
        return JSON.parse(rawConfig) as UserConfig
      } catch (error) {
        const typedError = error as NodeJS.ErrnoException

        if (typedError.code === 'ENOENT') {
          return {}
        }

        this.error(`Failed to read config at ${configPath}: ${typedError.message ?? String(error)}`)
      }
    })()

    return this.userConfigPromise
  }

  protected logTable(headers: TableColumn[], rows: TableRow[], options?: TableOptions): void {
    this.log(renderTable(headers, rows, options))
  }

  protected parseHeaderEntries(entries: string[], source: string): Record<string, string> {
    const headers: Record<string, string> = {}

    for (const entry of entries) {
      const trimmed = entry.trim()

      if (!trimmed) {
        continue
      }

      const colonIndex = trimmed.indexOf(':')
      const equalsIndex = trimmed.indexOf('=')
      let separatorIndex = -1

      if (colonIndex === -1) {
        separatorIndex = equalsIndex
      } else if (equalsIndex === -1) {
        separatorIndex = colonIndex
      } else {
        separatorIndex = Math.min(colonIndex, equalsIndex)
      }

      if (separatorIndex === -1) {
        this.error(`Invalid header "${entry}" from ${source}. Use "Key: Value" or "Key=Value".`)
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()

      if (!key) {
        this.error(`Invalid header "${entry}" from ${source}. Header name cannot be empty.`)
      }

      headers[key] = value
    }

    return headers
  }

  protected parseHeadersInput(input: unknown, source: string): Record<string, string> {
    if (input === undefined || input === null) {
      return {}
    }

    if (typeof input === 'string') {
      const trimmed = input.trim()

      if (!trimmed) {
        return {}
      }

      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed)
          return this.parseHeadersInput(parsed, `${source} JSON`)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          this.error(`Failed to parse headers from ${source}: ${message}`)
        }
      }

      return this.parseHeaderEntries([trimmed], source)
    }

    if (Array.isArray(input)) {
      const headers: Record<string, string> = {}

      for (const [index, entry] of input.entries()) {
        Object.assign(headers, this.parseHeadersInput(entry, `${source}[${index}]`))
      }

      return headers
    }

    if (typeof input === 'object') {
      const headers: Record<string, string> = {}

      for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
        if (value === undefined || value === null) {
          continue
        }

        headers[key] = String(value)
      }

      return headers
    }

    this.error(`Invalid headers from ${source}. Expected an object, array, or string.`)
  }

  protected async patchApiJson<T>(flags: ApiFlags, path: string, body: unknown): Promise<T> {
    const url = this.buildApiUrlFromFlags(flags, path)

    return this.requestJson<T>({
      body,
      headers: flags.headers,
      method: 'PATCH',
      token: flags.token,
      url,
    })
  }

  protected async postApiJson<T>(flags: ApiFlags, path: string, body: unknown): Promise<T> {
    const url = this.buildApiUrlFromFlags(flags, path)

    return this.requestJson<T>({
      body,
      headers: flags.headers,
      method: 'POST',
      token: flags.token,
      url,
    })
  }

  protected async requestJson<T>(options: {
    body?: unknown
    headers: Record<string, string>
    method: string
    token: string
    url: URL
  }): Promise<T> {
    const {body, headers, method, token, url} = options
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
      ...(body === undefined ? {} : {'Content-Type': 'application/json'}),
      ...headers,
    }
    const response = await fetch(url, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: requestHeaders,
      method,
    })

    if (!response.ok) {
      this.error(await this.formatErrorMessage(response))
    }

    return (await response.json()) as T
  }

  protected resolveDateFormat(
    flags: Record<string, unknown>,
    metadata: CommandMetadata | undefined,
    userConfig: UserConfig,
  ): string {
    const configDateFormat = userConfig['date-format'] ?? userConfig.dateFormat
    const flagValue = flags['date-format'] as string | undefined
    const usedDefault = metadata?.flags?.['date-format']?.setFromDefault

    if (usedDefault && configDateFormat) {
      return configDateFormat
    }

    return flagValue ?? configDateFormat ?? 'yyyy-MM-dd'
  }

  protected async resolveGlobalFlags(
    flags: Record<string, unknown>,
    metadata?: CommandMetadata,
  ): Promise<ResolvedGlobalFlags> {
    const userConfig = await this.loadUserConfig()
    const inputFlags = flags as Partial<ApiFlags>
    const hostname = inputFlags.hostname ?? userConfig.hostname
    const token = inputFlags.token ?? userConfig.token
    const dateFormat = this.resolveDateFormat(flags, metadata, userConfig)
    const headers = this.resolveHeaders(flags, userConfig)

    if (!hostname) {
      this.error('Missing required hostname. Set --hostname, PPLS_HOSTNAME, or config.json.')
    }

    if (!token) {
      this.error('Missing required token. Set --token, PPLS_TOKEN, or config.json.')
    }

    return {dateFormat, headers, hostname, token}
  }

  protected resolveHeaders(flags: Record<string, unknown>, userConfig: UserConfig): Record<string, string> {
    const configHeaders = this.parseHeadersInput(userConfig.headers ?? userConfig.header, 'config.json headers')
    const envHeaders = this.parseHeadersInput(process.env.PPLS_HEADERS, 'PPLS_HEADERS')
    const flagHeaders = this.parseHeadersInput(flags.header, '--header')

    return {
      ...configHeaders,
      ...envHeaders,
      ...flagHeaders,
    }
  }

  protected shouldShowSpinner(): boolean {
    return Boolean(process.stderr.isTTY)
  }

  protected startSpinner(text: string): null | ReturnType<typeof yoctoSpinner> {
    return this.shouldShowSpinner() ? yoctoSpinner({text}).start() : null
  }
}
