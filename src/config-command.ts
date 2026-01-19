import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'

import {BaseCommand} from './base-command.js'

export type ConfigData = Record<string, unknown>

export abstract class ConfigCommand extends BaseCommand {
  protected configFilePath(): string {
    return path.join(this.config.configDir, 'config.json')
  }

  protected async loadConfig(): Promise<ConfigData> {
    const configPath = this.configFilePath()

    try {
      const rawConfig = await readFile(configPath, 'utf8')
      const parsed = JSON.parse(rawConfig) as unknown

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        this.error(`Config at ${configPath} must be a JSON object.`)
      }

      return parsed as ConfigData
    } catch (error) {
      const typedError = error as NodeJS.ErrnoException

      if (typedError.code === 'ENOENT') {
        return {}
      }

      this.error(`Failed to read config at ${configPath}: ${typedError.message ?? String(error)}`)
    }
  }

  protected async saveConfig(config: ConfigData): Promise<void> {
    const configPath = this.configFilePath()
    await mkdir(this.config.configDir, {recursive: true})
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
  }
}
