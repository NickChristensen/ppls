import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('tags:update', () => {
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

  it('updates a tag with optional fields', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      const body = JSON.parse(init?.body as string) as Record<string, unknown>
      expect(body).to.deep.equal({
        color: '#ff0000',
        'is_inbox_tag': true,
        name: 'Inbox',
        parent: 12,
      })
      expect(init?.method).to.equal('PATCH')

      return new Response(
        JSON.stringify({
          children: [],
          'document_count': 0,
          id: 101,
          name: 'Inbox',
          slug: 'inbox',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('tags:update 101 --name Inbox --color "#ff0000" --parent 12 --inbox --plain')

    expect(stdout.trim()).to.equal('[101] Inbox')
    expect(new URL(requests[0]).pathname).to.equal('/api/tags/101/')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          children: [],
          'document_count': 3,
          id: 42,
          name: 'Todo',
          slug: 'todo',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('tags:update 42 --name Todo --json')
    const payload = JSON.parse(stdout) as {name: string}

    expect(payload.name).to.equal('Todo')
  })
})
