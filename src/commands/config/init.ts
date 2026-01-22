import {Command, Flags} from '@oclif/core'
import {stat} from 'node:fs/promises'

import {configPath, writeConfig} from '../../helpers/config-store.js'

type ConfigInitFlags = {
  force?: boolean
}

type ConfigInitResult = {
  overwritten: boolean
  path: string
}

export default class ConfigInit extends Command {
  static override description = 'Initialize a config file'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Overwrite existing config file'}),
  }

  public async run(): Promise<ConfigInitResult> {
    const {flags} = await this.parse()
    const typedFlags = flags as ConfigInitFlags
    const configFile = configPath(this.config.configDir)
    let exists = false

    try {
      await stat(configFile)
      exists = true
    } catch (error) {
      const typedError = error as NodeJS.ErrnoException

      if (typedError.code !== 'ENOENT') {
        this.error(`Failed to access config at ${configFile}: ${typedError.message ?? String(error)}`)
      }
    }

    if (exists && !typedFlags.force) {
      this.error(`Config already exists at ${configFile}. Use --force to overwrite.`)
    }

    await writeConfig(this.config.configDir, {
      dateFormat: 'YYYY-MM-DD',
      headers: {
        'Custom-Header': 'value',
      },
      hostname: 'http://example.com',
      token: 'your-api-token-here',
    })

    const result: ConfigInitResult = {overwritten: exists, path: configFile}

    if (!this.jsonEnabled()) {
      this.log(`Created config at ${configFile}`)
    }

    return result
  }
}
