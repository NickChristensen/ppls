import {Flags} from '@oclif/core'
import {stat} from 'node:fs/promises'

import {ConfigCommand} from '../../config-command.js'

type ConfigInitFlags = {
  force?: boolean
}

type ConfigInitResult = {
  overwritten: boolean
  path: string
}

export default class ConfigInit extends ConfigCommand {
  static override description = 'Initialize a config file'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Overwrite existing config file'}),
  }

  public async run(): Promise<ConfigInitResult> {
    const {flags} = await this.parse()
    const typedFlags = flags as ConfigInitFlags
    const configPath = this.configFilePath()
    let exists = false

    try {
      await stat(configPath)
      exists = true
    } catch (error) {
      const typedError = error as NodeJS.ErrnoException

      if (typedError.code !== 'ENOENT') {
        this.error(`Failed to access config at ${configPath}: ${typedError.message ?? String(error)}`)
      }
    }

    if (exists && !typedFlags.force) {
      this.error(`Config already exists at ${configPath}. Use --force to overwrite.`)
    }

    await this.saveConfig({})

    const result: ConfigInitResult = {overwritten: exists, path: configPath}

    if (!this.jsonEnabled()) {
      this.log(`Created config at ${configPath}`)
    }

    return result
  }
}
