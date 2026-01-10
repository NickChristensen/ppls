import {Flags} from '@oclif/core'

import {BaseCommand} from './base-command.js'

type PaginatedResponse<T> = {
  next?: string | null
  results?: T[]
}

export abstract class PaginatedCommand extends BaseCommand {
  static baseFlags = {
    ...BaseCommand.baseFlags,
    page: Flags.integer({description: 'Page number to fetch'}),
    'page-size': Flags.integer({description: 'Number of results per page'}),
  }

  protected buildPaginatedUrl(
    hostnameValue: string,
    path: string,
    page?: number,
    pageSize?: number,
    params: Record<string, string | number | undefined> = {},
  ): URL {
    if (page !== undefined && page < 1) {
      this.error('Invalid page value. Page must be 1 or greater.')
    }

    if (pageSize !== undefined && pageSize < 1) {
      this.error('Invalid page size. Page size must be 1 or greater.')
    }

    return this.buildApiUrl(hostnameValue, path, {
      ...params,
      page,
      page_size: pageSize,
    })
  }

  protected async *paginate<T>(
    url: URL,
    tokenValue: string,
    autoPaginate: boolean,
  ): AsyncGenerator<T> {
    let nextUrl: URL | null = url

    while (nextUrl) {
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
}
