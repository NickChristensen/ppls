import {Flags} from '@oclif/core'

import type {ApiFlags} from './base-command.js'

import {BaseCommand} from './base-command.js'

type PaginatedFlags = ApiFlags & {
  page?: number
  'page-size'?: number
}

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

  protected buildPaginatedUrlFromFlags(options: {
    flags: PaginatedFlags
    params?: Record<string, number | string | undefined>
    path: string
  }): URL {
    const {flags, params, path} = options
    return this.buildPaginatedUrl({
      hostname: flags.hostname,
      page: flags.page,
      pageSize: flags['page-size'],
      params,
      path,
    })
  }

  protected async fetchPaginatedResults<T>(options: {
    autoPaginate: boolean
    headers: Record<string, string>
    spinnerText?: string
    token: string
    url: URL
  }): Promise<T[]> {
    const {autoPaginate, headers, spinnerText, token, url} = options
    const spinner = this.startSpinner(spinnerText ?? `Fetching ${url.pathname}`)
    const results: T[] = []

    try {
      let nextUrl: null | URL = url

      while (nextUrl) {
        const currentUrl = nextUrl
        // eslint-disable-next-line no-await-in-loop -- pagination is sequential and depends on the next page URL.
        const payload: PaginatedResponse<T> = await this.fetchJson<PaginatedResponse<T>>(
          currentUrl,
          token,
          headers,
        )
        results.push(...(payload.results ?? []))

        if (!autoPaginate || !payload.next) {
          break
        }

        try {
          const parsedNext = new URL(payload.next, currentUrl)
          nextUrl = this.normalizeNextUrl(parsedNext, currentUrl)
        } catch {
          this.error('API returned an invalid next URL for pagination.')
        }
      }
    } finally {
      spinner?.stop()
    }

    return results
  }

  protected async fetchPaginatedResultsFromFlags<T>(options: {
    autoPaginate: boolean
    flags: {headers: Record<string, string>; token: string}
    spinnerText?: string
    url: URL
  }): Promise<T[]> {
    const {autoPaginate, flags, spinnerText, url} = options
    return this.fetchPaginatedResults<T>({
      autoPaginate,
      headers: flags.headers,
      spinnerText,
      token: flags.token,
      url,
    })
  }

  protected normalizeNextUrl(nextUrl: URL, currentUrl: URL): URL {
    if (currentUrl.protocol === 'https:' && nextUrl.protocol === 'http:' && nextUrl.hostname === currentUrl.hostname) {
      nextUrl.protocol = currentUrl.protocol
      if (currentUrl.port) {
        nextUrl.port = currentUrl.port
      }
    }

    return nextUrl
  }

  protected async *paginate<T>(
    url: URL,
    tokenValue: string,
    headers: Record<string, string>,
    autoPaginate: boolean,
  ): AsyncGenerator<T> {
    let nextUrl: null | URL = url

    while (nextUrl) {
      const currentUrl = nextUrl
      // eslint-disable-next-line no-await-in-loop -- pagination is sequential and depends on the next page URL.
      const payload: PaginatedResponse<T> = await this.fetchJson<PaginatedResponse<T>>(
        currentUrl,
        tokenValue,
        headers,
      )
      const results = payload.results ?? []

      for (const result of results) {
        yield result
      }

      if (!autoPaginate || !payload.next) {
        break
      }

      try {
        const parsedNext = new URL(payload.next, currentUrl)
        nextUrl = this.normalizeNextUrl(parsedNext, currentUrl)
      } catch {
        this.error('API returned an invalid next URL for pagination.')
      }
    }
  }
}
