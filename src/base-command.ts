import {Command, Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import yoctoSpinner from 'yocto-spinner'

import {hostname, token} from './flags.js'
import {renderTable, type TableColumn, type TableOptions, type TableRow} from './helpers/table.js'

export type ApiFlags = {
  hostname: string
  token: string
}

type UserConfig = Partial<ApiFlags>

export abstract class BaseCommand extends Command {
  static baseFlags = {
    'date-format': Flags.string({
      default: 'yyyy-MM-dd',
      description: 'Format output dates using a template.',
      helpGroup: 'GLOBAL',
    }),
    hostname,
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
    token,
  }
  static enableJsonFlag = true

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

  protected async fetchApiJson<T>(
    flags: ApiFlags,
    path: string,
    params: Record<string, number | string | undefined> = {},
  ): Promise<T> {
    const url = this.buildApiUrlFromFlags(flags, path, params)
    return this.fetchJson<T>(url, flags.token)
  }

  protected async fetchJson<T>(url: URL, tokenValue: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${tokenValue}`,
      },
    })

    if (!response.ok) {
      this.error(`Request failed with ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  }

  protected async loadUserConfig(): Promise<UserConfig> {
    const configPath = path.join(this.config.configDir, 'config.json')

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
  }

  protected logTable(headers: TableColumn[], rows: TableRow[], options?: TableOptions): void {
    this.log(renderTable(headers, rows, options))
  }

  protected async resolveApiFlags(flags: Record<string, unknown>): Promise<ApiFlags> {
    const userConfig = await this.loadUserConfig()
    const inputFlags = flags as Partial<ApiFlags>
    const hostname = inputFlags.hostname ?? userConfig.hostname
    const token = inputFlags.token ?? userConfig.token

    if (!hostname) {
      this.error('Missing required hostname. Set --hostname, PPLS_HOSTNAME, or config.json.')
    }

    if (!token) {
      this.error('Missing required token. Set --token, PPLS_TOKEN, or config.json.')
    }

    return {hostname, token}
  }

  protected shouldShowSpinner(): boolean {
    return Boolean(process.stderr.isTTY)
  }

  protected startSpinner(text: string): null | ReturnType<typeof yoctoSpinner> {
    return this.shouldShowSpinner() ? yoctoSpinner({text}).start() : null
  }
}
