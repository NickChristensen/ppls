import {Args} from '@oclif/core'

import {BaseCommand} from '../../base-command.js'
import {type ConfigData, readConfig, writeConfig} from '../../helpers/config-store.js'

type ConfigSetArgs = {
  key: string
  value: string
}

const parseConfigValue = (raw: string): unknown => {
  let trimmed = raw.trim()

  if (!trimmed) {
    return ''
  }

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    trimmed = trimmed.slice(1, -1).trim()
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Invalid JSON value: ${message}`)
    }
  }

  return trimmed
}

export default class ConfigSet extends BaseCommand {
  static override args = {
    key: Args.string({description: 'Config key', required: true}),
    value: Args.string({description: 'Config value', required: true}),
  }
  static override description = 'Set a config value'
  static override examples = [
    '<%= config.bin %> <%= command.id %> hostname https://paperless.example.com',
    '<%= config.bin %> <%= command.id %> headers \'{"X-Api-Key":"token"}\'',
  ]

  public async run(): Promise<ConfigData> {
    const {args} = await this.parse()
    const typedArgs = args as ConfigSetArgs
    const config = await readConfig(this.config.configDir)
    let parsedValue: unknown

    try {
      parsedValue = parseConfigValue(typedArgs.value)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(message)
    }

    if (
      typedArgs.key === 'headers' &&
      (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue))
    ) {
      this.warn('Config key "headers" must be a JSON object. Example: {"X-Api-Key":"token"}')
      return config
    }

    config[typedArgs.key] = parsedValue
    await writeConfig(this.config.configDir, config)

    if (!this.jsonEnabled()) {
      this.log(`Set ${typedArgs.key}`)
    }

    return config
  }
}
