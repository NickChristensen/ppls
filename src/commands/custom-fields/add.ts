import {Args, Flags} from '@oclif/core'

import type {CustomField, CustomFieldCreate} from '../../types/custom-fields.js'

import {AddCommand} from '../../add-command.js'

type CustomFieldsAddArgs = {
  name: string
}

type CustomFieldsAddFlags = {
  'data-type': string
  option?: string[]
}

const dataTypeOptions = [
  'boolean',
  'date',
  'integer',
  'number',
  'monetary',
  'text',
  'url',
  'document link',
  'select',
  'long text',
] as const

const dataTypeMap: Record<(typeof dataTypeOptions)[number], CustomFieldCreate['data_type']> = {
  boolean: 'boolean',
  date: 'date',
  'document link': 'documentlink',
  integer: 'integer',
  'long text': 'longtext',
  monetary: 'monetary',
  number: 'float',
  select: 'select',
  text: 'string',
  url: 'url',
}

export default class CustomFieldsAdd extends AddCommand<CustomFieldCreate, CustomField> {
  static override args = {
    name: Args.string({description: 'Custom field name', required: true}),
  }
  static override description = 'Create a custom field'
  static override examples = ['<%= config.bin %> <%= command.id %> "Due Date" --data-type date']
  static override flags = {
    'data-type': Flags.string({
      description: 'Custom field data type',
      options: [...dataTypeOptions],
      relationships: [
        {
          flags: [
            {
              name: 'option',
              when: async (flags: Record<string, unknown>) => flags['data-type'] === 'select',
            },
          ],
          type: 'all',
        },
      ],
      required: true,
    }),
    option: Flags.string({
      description: 'Select option label (repeatable)',
      multiple: true,
    }),
  }
  protected createPath = '/api/custom_fields/'

  protected buildPayload(args: unknown, flags: Record<string, unknown>): CustomFieldCreate {
    const typedArgs = args as CustomFieldsAddArgs
    const dataType = (flags['data-type'] as CustomFieldsAddFlags['data-type']).trim().toLowerCase()
    const mappedType = dataTypeMap[dataType as keyof typeof dataTypeMap]
    const options = (flags.option as CustomFieldsAddFlags['option'] | undefined) ?? []
    const selectOptions = options.map((option) => option.trim()).filter(Boolean)

    if (!mappedType) {
      this.error(`Unsupported data type "${dataType}".`)
    }

    return {
      'data_type': mappedType,
      'extra_data':
        mappedType === 'select'
          ? {
              'select_options': selectOptions.map((label) => ({label})),
            }
          : undefined,
      name: typedArgs.name,
    }
  }

  protected plainTemplate(field: CustomField): string | undefined {
    const count = field.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${field.id}] ${field.name}${suffix}`
  }
}
