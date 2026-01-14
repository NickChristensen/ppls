import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('correspondents:add', () => {
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

  it('creates a correspondent', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      const body = JSON.parse(init?.body as string) as Record<string, unknown>
      expect(body).to.deep.equal({'matching_algorithm': 6, name: 'Acme Corp'})
      expect(init?.method).to.equal('POST')

      return new Response(
        JSON.stringify({
          'document_count': 0,
          id: 12,
          'last_correspondence': '2024-01-01',
          name: 'Acme Corp',
          permissions: {
            change: {groups: [], users: []},
            view: {groups: [], users: []},
          },
          slug: 'acme-corp',
          'user_can_change': true,
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 201,
        },
      )
    }

    const {stdout} = await runCommand('correspondents:add "Acme Corp" --plain')

    expect(stdout.trim()).to.equal('[12] Acme Corp')
    expect(new URL(requests[0]).pathname).to.equal('/api/correspondents/')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          'document_count': 0,
          id: 99,
          'last_correspondence': '2024-01-01',
          name: 'Umbrella Corp',
          permissions: {
            change: {groups: [], users: []},
            view: {groups: [], users: []},
          },
          slug: 'umbrella-corp',
          'user_can_change': true,
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 201,
        },
      )

    const {stdout} = await runCommand('correspondents:add "Umbrella Corp" --json')
    const payload = JSON.parse(stdout) as {name: string}

    expect(payload.name).to.equal('Umbrella Corp')
  })

  it('surfaces error messages from the API', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          error: 'Object violates owner / name unique constraint',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 400,
        },
      )

    const {error} = await runCommand('correspondents:add "Acme Corp"')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('Object violates owner / name unique constraint')
  })
})
