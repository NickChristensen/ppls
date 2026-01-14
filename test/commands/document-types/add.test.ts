import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('document-types:add', () => {
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

  it('creates a document type', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      const body = JSON.parse(init?.body as string) as Record<string, unknown>
      expect(body).to.deep.equal({'matching_algorithm': 6, name: 'Invoice'})
      expect(init?.method).to.equal('POST')

      return new Response(
        JSON.stringify({
          'document_count': 0,
          id: 10,
          name: 'Invoice',
          permissions: {
            change: {groups: [], users: []},
            view: {groups: [], users: []},
          },
          slug: 'invoice',
          'user_can_change': true,
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 201,
        },
      )
    }

    const {stdout} = await runCommand('document-types:add "Invoice" --plain')

    expect(stdout.trim()).to.equal('[10] Invoice (0 documents)')
    expect(new URL(requests[0]).pathname).to.equal('/api/document_types/')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          'document_count': 0,
          id: 22,
          name: 'Receipt',
          permissions: {
            change: {groups: [], users: []},
            view: {groups: [], users: []},
          },
          slug: 'receipt',
          'user_can_change': true,
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 201,
        },
      )

    const {stdout} = await runCommand('document-types:add "Receipt" --json')
    const payload = JSON.parse(stdout) as {name: string}

    expect(payload.name).to.equal('Receipt')
  })
})
