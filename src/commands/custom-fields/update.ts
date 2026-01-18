import {Args, Flags} from '@oclif/core'

import type {CustomField, CustomFieldUpdate} from '../../types/custom-fields.js'

import {UpdateCommand} from '../../update-command.js'

type CustomFieldsUpdateFlags = {
  'data-type'?: string
  name?: string
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

const dataTypeMap: Record<(typeof dataTypeOptions)[number], CustomFieldUpdate['data_type']> = {
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

export default class CustomFieldsUpdate extends UpdateCommand<CustomFieldUpdate, CustomField> {
  static override args = {
    id: Args.integer({description: 'Custom field id', required: true}),
  }
  static override description = 'Update a custom field'
  static override examples = ['<%= config.bin %> <%= command.id %> 123 --name "Due Date"']
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
    }),
    name: Flags.string({description: 'Custom field name'}),
    option: Flags.string({
      description: 'Select option label (repeatable)',
      multiple: true,
      relationships: [
        {
          flags: [
            {
              name: 'data-type',
              when: async (flags: Record<string, unknown>) => flags['data-type'] !== 'select',
            },
          ],
          type: 'none',
        },
      ],
    }),
  }

  protected buildPayload(_args: unknown, flags: Record<string, unknown>): CustomFieldUpdate {
    const typedFlags = flags as CustomFieldsUpdateFlags
    const dataType = typedFlags['data-type']?.trim().toLowerCase()
    const mappedType = dataType ? dataTypeMap[dataType as keyof typeof dataTypeMap] : undefined
    const options = typedFlags.option ?? []
    const selectOptions = options.map((option) => option.trim()).filter(Boolean)

    if (dataType && !mappedType) {
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
      name: typedFlags.name,
    }
  }

  protected plainTemplate(field: CustomField): string | undefined {
    const count = field.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${field.id}] ${field.name}${suffix}`
  }

  protected updatePath(id: number | string): string {
    return `/api/custom_fields/${id}/`
  }
}
