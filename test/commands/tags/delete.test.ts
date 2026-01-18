import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('tags:delete', () => {
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

  it('deletes a tag', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      expect(init?.method).to.equal('DELETE')

      return new Response(null, {
        status: 204,
      })
    }

    const {stdout} = await runCommand('tags:delete 101 --yes')

    expect(stdout.trim()).to.equal('Deleted tag 101')
    expect(new URL(requests[0]).pathname).to.equal('/api/tags/101/')
  })
})
