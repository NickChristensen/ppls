import {Args, Command} from '@oclif/core'

import {type ConfigData, readConfig} from '../../helpers/config-store.js'

type ConfigGetArgs = {
  key: string
}

export default class ConfigGet extends Command {
  static override args = {
    key: Args.string({description: 'Config key', required: true}),
  }
  static override description = 'Get a config value'
  static override enableJsonFlag = true
  static override examples = ['<%= config.bin %> <%= command.id %> hostname']

  public async run(): Promise<ConfigData> {
    const {args} = await this.parse()
    const typedArgs = args as ConfigGetArgs
    const config = await readConfig(this.config.configDir)

    if (!Object.hasOwn(config, typedArgs.key)) {
      if (!this.jsonEnabled()) {
        this.log(`Config key ${typedArgs.key} not set.`)
      }

      return {}
    }

    const value = config[typedArgs.key]

    if (!this.jsonEnabled()) {
      if (value === null || value === undefined) {
        this.log('')
      } else if (typeof value === 'string') {
        this.log(value)
      } else {
        this.log(JSON.stringify(value))
      }
    }

    return {[typedArgs.key]: value}
  }
}
