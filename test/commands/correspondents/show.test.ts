import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('correspondents:show', () => {
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

  it('shows correspondent details in plain output', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          'document_count': 3,
          id: 42,
          name: 'Acme',
          slug: 'acme',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('correspondents:show 42 --plain')

    expect(stdout.trim()).to.equal('[42] Acme (3 documents)')
    expect(new URL(requests[0]).pathname).to.equal('/api/correspondents/42/')
  })

  it('renders a table by default', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          'document_count': 3,
          id: 42,
          name: 'Acme',
          slug: 'acme',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('correspondents:show 42')

    expect(stdout).to.contain('Id')
    expect(stdout).to.contain('42')
    expect(stdout).to.contain('Name')
    expect(stdout).to.contain('Acme')
    expect(stdout).to.contain('Document Count')
  })
})
