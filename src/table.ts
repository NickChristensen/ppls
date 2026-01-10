import type * as TtyTable from 'tty-table'

import {createRequire} from 'node:module'

export type TableColumn = TtyTable.Header
export type TableFormatterContext = {
  configure: (options: Record<string, unknown>) => void
  resetStyle: (cellValue: string) => string
  style: (cellValue: string, ...effects: string[]) => string
}
export type TableFormatter = (
  this: TableFormatterContext,
  ...args: Parameters<TtyTable.Formatter>
) => ReturnType<TtyTable.Formatter>
export type TableOptions = TtyTable.Options & {showHeader?: boolean}
export type TableRow = Record<string, unknown> | unknown[]

export const formatLabel = (value: string): string =>
  value.replaceAll('_', ' ').replaceAll(/\b\w/g, (match) => match.toUpperCase())

export const formatField: TableFormatter = function (cellValue: unknown): string {
  if (cellValue === null || cellValue === undefined) {
    return ''
  }

  if (typeof cellValue === 'string') {
    return formatLabel(cellValue)
  }

  return formatLabel(String(cellValue))
}

export const formatValue: TableFormatter = function (cellValue: unknown): string {
  if (cellValue === null || cellValue === undefined) {
    return ''
  }

  if (typeof cellValue === 'string') {
    return cellValue
  }

  if (typeof cellValue === 'number') {
    return this.style(String(cellValue), 'blue')
  }

  if (typeof cellValue === 'boolean') {
    return cellValue ? this.style('true', 'green', 'bold') : this.style('false', 'red', 'bold')
  }

  return this.style(JSON.stringify(cellValue), 'gray')
}

type TtyTable = (
  headers: TableColumn[],
  rows: TableRow[],
  options?: TableOptions,
) => {
  render(): string
}

const require = createRequire(import.meta.url)
const ttyTable = require('tty-table') as TtyTable

export const renderTable = (headers: TableColumn[], rows: TableRow[], options?: TableOptions): string =>
  ttyTable(
    headers.map((header) => ({
      alias: header.alias ?? formatLabel(header.value),
      align: 'left',
      headerAlign: 'left',
      ...header,
    })),
    rows,
    {
      compact: true,
      ...options,
    },
  ).render()
