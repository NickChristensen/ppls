import type {CustomField} from '../../types/custom-fields.js'

import {ListCommand} from '../../list-command.js'

export default class CustomFieldsList extends ListCommand<CustomField> {
  static override description = 'List custom fields'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  protected listPath = '/api/custom_fields/'
  protected tableAttrs = ['id', 'name', 'data_type', 'document_count']

  protected plainTemplate(customField: CustomField): string | undefined {
    const count = customField.document_count
    const suffix = count === undefined ? '' : ` (${count} ${count === 1 ? 'document' : 'documents'})`

    return `[${customField.id}] ${customField.name}${suffix}`
  }
}
