import {createRequire} from 'node:module'

export type TableColumn = {
  alias?: string
  align?: 'left'
  headerAlign?: 'left'
  value: string
  width?: number | string
}

export type TableOptions = {
  borderColor?: string
  borderStyle?: string
  color?: string
  compact?: boolean
  truncate?: boolean | string
  width?: string
}

export type TableRow = Record<string, unknown> | unknown[]

const formatAlias = (value: string): string =>
  value
    .replaceAll('_', ' ')
    .replaceAll(/\b\w/g, (match) => match.toUpperCase())

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
      alias: header.alias ?? formatAlias(header.value),
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
