import {Command, Flags} from '@oclif/core'

import {type ConfigData, readConfig} from '../../helpers/config-store.js'
import {renderTable} from '../../helpers/table.js'

type ConfigListFlags = {
  plain?: boolean
  table?: boolean
}

type ConfigRow = {
  key: string
  value: string
}

const formatConfigValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return JSON.stringify(value)
}

export default class ConfigList extends Command {
  static override description = 'List config values'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    plain: Flags.boolean({
      description: 'Format output as plain text.',
      exclusive: ['json', 'table'],
    }),
    table: Flags.boolean({
      description: 'Format output as table.',
      exclusive: ['json', 'plain'],
    }),
  }

  public async run(): Promise<ConfigData> {
    const {flags} = await this.parse()
    const typedFlags = flags as ConfigListFlags
    const config = await readConfig(this.config.configDir)

    if (this.jsonEnabled()) {
      return config
    }

    const entries = Object.entries(config)

    if (entries.length === 0) {
      this.log('No config values set.')
      return config
    }

    if (typedFlags.plain) {
      for (const [key, value] of entries) {
        this.log(`${key}=${formatConfigValue(value)}`)
      }

      return config
    }

    const rows = this.buildRows(config)
    const output = renderTable(
      [
        {align: 'right', formatter: String, value: 'key'},
        {value: 'value'},
      ],
      rows,
      {showHeader: false},
    )

    this.log(output)

    return config
  }

  private buildRows(config: ConfigData): ConfigRow[] {
    return Object.entries(config)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        key,
        value: formatConfigValue(value),
      }))
  }
}
