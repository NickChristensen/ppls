import {Args} from '@oclif/core'

import type {CustomField} from '../../types/custom-fields.js'

import {ShowCommand} from '../../show-command.js'

export default class CustomFieldsShow extends ShowCommand<CustomField> {
  static override args = {
    id: Args.integer({description: 'Custom field id', required: true}),
  }
  static override description = 'Show custom field details'
  static override examples = ['<%= config.bin %> <%= command.id %> 123']

  protected plainTemplate(customField: CustomField): string | undefined {
    const count = customField.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${customField.id}] ${customField.name}${suffix}`
  }

  protected showPath(id: number | string): string {
    return `/api/custom_fields/${id}/`
  }
}
