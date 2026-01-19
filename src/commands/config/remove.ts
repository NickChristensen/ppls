import {Args} from '@oclif/core'

import {ConfigCommand, type ConfigData} from '../../config-command.js'

type ConfigRemoveArgs = {
  key: string
}

export default class ConfigRemove extends ConfigCommand {
  static override args = {
    key: Args.string({description: 'Config key', required: true}),
  }
  static override description = 'Remove a config value'
  static override examples = ['<%= config.bin %> <%= command.id %> token']

  public async run(): Promise<ConfigData> {
    const {args} = await this.parse()
    const typedArgs = args as ConfigRemoveArgs
    const config = await this.loadConfig()

    if (Object.hasOwn(config, typedArgs.key)) {
      delete config[typedArgs.key]
      await this.saveConfig(config)

      if (!this.jsonEnabled()) {
        this.log(`Removed ${typedArgs.key}`)
      }
    } else if (!this.jsonEnabled()) {
      this.log(`Config key ${typedArgs.key} not set.`)
    }

    return config
  }
}
