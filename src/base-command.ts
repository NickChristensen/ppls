import {Command} from '@oclif/core'
import yoctoSpinner from 'yocto-spinner'

import {hostname, token} from './flags.js'

export abstract class BaseCommand extends Command {
  static baseFlags = {
    hostname,
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

  protected startSpinner(text: string): ReturnType<typeof yoctoSpinner> | null {
    return this.shouldShowSpinner() ? yoctoSpinner({text}).start() : null
  }

  protected shouldShowSpinner(): boolean {
    return Boolean(process.stderr.isTTY)
  }
}
