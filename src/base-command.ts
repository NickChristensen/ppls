import {Command, Flags} from '@oclif/core'
import yoctoSpinner from 'yocto-spinner'

import {hostname, token} from './flags.js'
import {renderTable, type TableColumn, type TableOptions, type TableRow} from './table.js'

export type ApiFlags = {
  hostname: string
  token: string
}

export abstract class BaseCommand extends Command {
  static baseFlags = {
    hostname,
    plain: Flags.boolean({description: 'Output as plain text', exclusive: ['json', 'table']}),
    sort: Flags.string({description: 'Sort results by the provided field'}),
    table: Flags.boolean({description: 'Output as a table', exclusive: ['json', 'plain']}),
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

  protected logTable(headers: TableColumn[], rows: TableRow[], options?: TableOptions): void {
    this.log(renderTable(headers, rows, options))
  }

  protected shouldShowSpinner(): boolean {
    return Boolean(process.stderr.isTTY)
  }

  protected startSpinner(text: string): null | ReturnType<typeof yoctoSpinner> {
    return this.shouldShowSpinner() ? yoctoSpinner({text}).start() : null
  }
}
