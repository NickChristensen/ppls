import {Flags} from '@oclif/core'

import {BaseCommand} from './base-command.js'

type PaginatedResponse<T> = {
  next?: null | string
  results?: T[]
}

export abstract class PaginatedCommand extends BaseCommand {
  static baseFlags = {
    ...BaseCommand.baseFlags,
    page: Flags.integer({description: 'Page number to fetch'}),
    'page-size': Flags.integer({description: 'Number of results per page'}),
  }

  protected buildPaginatedUrl(options: {
    hostname: string
    page?: number
    pageSize?: number
    params?: Record<string, number | string | undefined>
    path: string
  }): URL {
    const {hostname, page, pageSize, params = {}, path} = options

    if (page !== undefined && page < 1) {
      this.error('Invalid page value. Page must be 1 or greater.')
    }

    if (pageSize !== undefined && pageSize < 1) {
      this.error('Invalid page size. Page size must be 1 or greater.')
    }

    return this.buildApiUrl(hostname, path, {
      ...params,
      page,
      'page_size': pageSize,
    })
  }

  protected async *paginate<T>(
    url: URL,
    tokenValue: string,
    autoPaginate: boolean,
  ): AsyncGenerator<T> {
    let nextUrl: null | URL = url

    while (nextUrl) {
      // eslint-disable-next-line no-await-in-loop -- pagination is sequential and depends on the next page URL.
      const payload: PaginatedResponse<T> = await this.fetchJson<PaginatedResponse<T>>(nextUrl, tokenValue)
      const results = payload.results ?? []

      for (const result of results) {
        yield result
      }

      if (!autoPaginate || !payload.next) {
        break
      }

      try {
        nextUrl = new URL(payload.next, nextUrl)
      } catch {
        this.error('API returned an invalid next URL for pagination.')
      }
    }
  }

  protected async fetchPaginatedResults<T>(options: {
    autoPaginate: boolean
    spinnerText?: string
    token: string
    url: URL
  }): Promise<T[]> {
    const {autoPaginate, spinnerText, token, url} = options
    const spinner = this.startSpinner(spinnerText ?? `Fetching ${url.pathname}`)
    const results: T[] = []

    try {
      let nextUrl: null | URL = url

      while (nextUrl) {
        // eslint-disable-next-line no-await-in-loop -- pagination is sequential and depends on the next page URL.
        const payload: PaginatedResponse<T> = await this.fetchJson<PaginatedResponse<T>>(nextUrl, token)
        results.push(...(payload.results ?? []))

        if (!autoPaginate || !payload.next) {
          break
        }

        try {
          nextUrl = new URL(payload.next, nextUrl)
        } catch {
          this.error('API returned an invalid next URL for pagination.')
        }
      }
    } finally {
      spinner?.stop()
    }

    return results
  }
}
