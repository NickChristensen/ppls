import {Flags} from '@oclif/core'

export const hostname = Flags.string({
  description: 'Paperless-ngx base URL',
  env: 'PPLS_HOSTNAME',
  helpGroup: 'ENVIRONMENT',
})

export const token = Flags.string({
  description: 'Paperless-ngx API token',
  env: 'PPLS_TOKEN',
  helpGroup: 'ENVIRONMENT',
})
