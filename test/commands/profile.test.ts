import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('profile', () => {
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

  const profilePayload = {
    'auth_token': 'token-value',
    email: 'ada@example.com',
    'first_name': 'Ada',
    'has_usable_password': true,
    'is_mfa_enabled': false,
    'last_name': 'Lovelace',
    'social_accounts': [],
  }

  it('renders a table by default', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(JSON.stringify(profilePayload), {
        headers: {'Content-Type': 'application/json'},
        status: 200,
      })
    }

    const {stdout} = await runCommand('profile')

    expect(stdout).to.contain('Email')
    expect(stdout).to.contain('ada@example.com')
    expect(new URL(requests[0]).pathname).to.equal('/api/profile/')
  })

  it('supports the whoami alias', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(JSON.stringify(profilePayload), {
        headers: {'Content-Type': 'application/json'},
        status: 200,
      })
    }

    const {stdout} = await runCommand('whoami --json')
    const payload = JSON.parse(stdout) as {email: string}

    expect(payload.email).to.equal('ada@example.com')
    expect(new URL(requests[0]).pathname).to.equal('/api/profile/')
  })
})
