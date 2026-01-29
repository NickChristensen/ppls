import {Command, Flags} from '@oclif/core'
import yoctoSpinner from 'yocto-spinner'

import {readConfig} from './helpers/config-store.js'
import {renderTable, type TableColumn, type TableOptions, type TableRow} from './helpers/table.js'

export type ApiFlags = {
  headers: Record<string, string>
  hostname: string
  token: string
}

type QueryParams = Record<string, number | number[] | string | string[] | undefined>

type ResolvedGlobalFlags = ApiFlags & {
  dateFormat: string
}

type UserConfig = Partial<ApiFlags> & {
  dateFormat?: string
  headers?: Record<string, unknown>
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
    params: QueryParams = {},
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
    params: QueryParams = {},
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

  protected async fetchApiBinary(
    flags: ApiFlags,
    path: string,
    params: QueryParams = {},
  ): Promise<{data: Uint8Array; headers: Headers}> {
    const url = this.buildApiUrlFromFlags(flags, path, params)
    const requestHeaders: Record<string, string> = {
      Accept: '*/*',
      Authorization: `Token ${flags.token}`,
      ...flags.headers,
    }
    const response = await fetch(url, {
      headers: requestHeaders,
    })

    if (!response.ok) {
      this.error(await this.formatErrorMessage(response))
    }

    return {
      data: new Uint8Array(await response.arrayBuffer()),
      headers: response.headers,
    }
  }

  protected async fetchApiJson<T>(
    flags: ApiFlags,
    path: string,
    params: QueryParams = {},
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

    this.userConfigPromise = (async () => {
      try {
        return (await readConfig(this.config.configDir)) as UserConfig
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        this.error(message)
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

      const equalsIndex = trimmed.indexOf('=')
      const separatorIndex = equalsIndex

      if (separatorIndex === -1) {
        this.error(`Invalid header "${entry}" from ${source}. Use "Key=Value".`)
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

  protected parseHeadersConfig(input: unknown, source: string): Record<string, string> {
    if (input === undefined || input === null) {
      return {}
    }

    if (typeof input !== 'object' || Array.isArray(input)) {
      this.error(`Invalid headers from ${source}. Expected an object of header key/value pairs.`)
    }

    const headers: Record<string, string> = {}

    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (value === undefined || value === null) {
        continue
      }

      headers[key] = String(value)
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

      return this.parseHeaderEntries([trimmed], source)
    }

    if (Array.isArray(input)) {
      const headers: Record<string, string> = {}

      for (const [index, entry] of input.entries()) {
        Object.assign(headers, this.parseHeadersInput(entry, `${source}[${index}]`))
      }

      return headers
    }

    this.error(`Invalid headers from ${source}. Expected a string or array of strings.`)
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

  protected async postApiFormData<T>(flags: ApiFlags, path: string, body: FormData): Promise<T> {
    const url = this.buildApiUrlFromFlags(flags, path)
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      Authorization: `Token ${flags.token}`,
      ...flags.headers,
    }
    const response = await fetch(url, {
      body,
      headers: requestHeaders,
      method: 'POST',
    })

    if (!response.ok) {
      this.error(await this.formatErrorMessage(response))
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      return (await response.json()) as T
    }

    return (await response.text()) as T
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
    const configDateFormat = userConfig.dateFormat
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
      this.error('hostname required. Use --hostname, set PPLS_HOSTNAME, or use `ppls config set hostname <value>`')
    }

    if (!token) {
      this.error('token required. Use --token, set PPLS_TOKEN, or use `ppls config set token <value>`')
    }

    return {dateFormat, headers, hostname, token}
  }

  protected resolveHeaders(flags: Record<string, unknown>, userConfig: UserConfig): Record<string, string> {
    const configHeaders = this.parseHeadersConfig(userConfig.headers, 'config.json headers')
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
