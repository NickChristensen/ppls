import {Command} from '@oclif/core'

import {hostname, token} from './flags.js'

export abstract class BaseCommand extends Command {
  static baseFlags = {
    hostname,
    token,
  }

  protected buildApiUrl(
    hostnameValue: string,
    path: string,
    params: Record<string, string | number | undefined> = {},
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
        Authorization: `Token ${tokenValue}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      this.error(`Request failed with ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  }
}
