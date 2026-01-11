import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('documents:show', () => {
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

  it('shows document details in plain output', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          added: '2024-01-02T01:02:03Z',
          correspondent: 1,
          created: '2024-01-01',
          'document_type': 2,
          id: 42,
          title: 'Inbox Document',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('documents:show 42 --plain')

    expect(stdout.trim()).to.equal('[42] Inbox Document')
    expect(new URL(requests[0]).pathname).to.equal('/api/documents/42/')
  })

  it('renders a table by default', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          added: '2024-01-02T01:02:03Z',
          correspondent: 1,
          created: '2024-01-01',
          'document_type': 2,
          id: 42,
          title: 'Inbox Document',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('documents:show 42')

    expect(stdout).to.contain('Id')
    expect(stdout).to.contain('42')
    expect(stdout).to.contain('Title')
    expect(stdout).to.contain('Inbox Document')
  })
})
