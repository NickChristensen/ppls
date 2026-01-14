import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('custom-fields:add', () => {
  const originalEnv = {
    hostname: process.env.PPLS_HOSTNAME,
    token: process.env.PPLS_TOKEN,
  }
  const originalFetch = globalThis.fetch
  let requests: string[] = []

  beforeEach(() => {
    process.env.PPLS_HOSTNAME = 'https://paperless.example.test'
    process.env.PPLS_TOKEN = 'test-token'
    requests = []
  })

  afterEach(() => {
    if (originalEnv.hostname === undefined) {
      delete process.env.PPLS_HOSTNAME
    } else {
      process.env.PPLS_HOSTNAME = originalEnv.hostname
    }

    if (originalEnv.token === undefined) {
      delete process.env.PPLS_TOKEN
    } else {
      process.env.PPLS_TOKEN = originalEnv.token
    }

    globalThis.fetch = originalFetch
  })

  it('creates a custom field', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      const body = JSON.parse(init?.body as string) as Record<string, unknown>
      expect(body).to.deep.equal({
        'data_type': 'select',
        'extra_data': {
          'select_options': [{label: 'apple'}, {label: 'banana'}],
        },
        name: 'Receipt Link',
      })
      expect(init?.method).to.equal('POST')

      return new Response(
        JSON.stringify({
          'data_type': 'select',
          'document_count': 0,
          id: 9,
          name: 'Receipt Link',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 201,
        },
      )
    }

    const {stdout} = await runCommand(
      'custom-fields:add "Receipt Link" --data-type select --option apple --option banana --plain',
    )

    expect(stdout.trim()).to.equal('[9] Receipt Link (0 documents)')
    expect(new URL(requests[0]).pathname).to.equal('/api/custom_fields/')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          'data_type': 'date',
          'document_count': 0,
          id: 12,
          name: 'Due Date',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 201,
        },
      )

    const {stdout} = await runCommand('custom-fields:add "Due Date" --data-type date --json')
    const payload = JSON.parse(stdout) as {data_type: string; name: string}

    expect(payload.name).to.equal('Due Date')
    expect(payload.data_type).to.equal('date')
  })

  it('requires options for select fields', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('custom-fields:add "Fruit" --data-type select')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('must be provided when using --data-type: --option')
  })

  it('rejects options for non-select fields', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('custom-fields:add "Amount" --data-type number --option apple')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('Only the following can be provided when using --option')
  })
})
