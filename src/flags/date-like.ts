import {Flags} from '@oclif/core'

import {isDateOnly, isDateTime} from '../helpers/date-utils.js'

export const dateLike = Flags.custom<string>({
  helpValue: 'YYYY-MM-DD|ISO-8601',
  async parse(input: string): Promise<string> {
    if (isDateOnly(input) || isDateTime(input)) {
      return input
    }

    throw new Error('Use YYYY-MM-DD or an ISO 8601 datetime.')
  },
})
