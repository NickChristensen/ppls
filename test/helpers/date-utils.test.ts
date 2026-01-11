import {expect} from 'chai'

import {isDateOnly, isDateTime} from '../../src/helpers/date-utils.js'

describe('date-utils', () => {
  it('detects date-only strings', () => {
    expect(isDateOnly('2026-01-07')).to.equal(true)
    expect(isDateOnly('2026-01-07T19:16:34.961944-06:00')).to.equal(false)
  })

  it('detects date-time strings with offsets and microseconds', () => {
    expect(isDateTime('2026-01-07T19:16:34.961944-06:00')).to.equal(true)
  })

  it('rejects date-only strings as date-time', () => {
    expect(isDateTime('2026-01-07')).to.equal(false)
  })
})
