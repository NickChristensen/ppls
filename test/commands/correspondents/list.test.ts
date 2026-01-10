import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('correspondents:list', () => {
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

  it('lists correspondent names across pages by default', async () => {
    const responses = [
      {
        status: 200,
        body: {
          results: [{name: 'Acme'}],
          next: '/api/correspondents/?page=2',
        },
      },
      {
        status: 200,
        body: {
          results: [{name: 'Umbrella Corp'}],
          next: null,
        },
      },
    ]

    globalThis.fetch = async (input) => {
      requests.push(String(input))
      const response = responses.shift()

      if (!response) {
        throw new Error('Unexpected fetch call')
      }

      return new Response(JSON.stringify(response.body), {
        status: response.status,
        headers: {'Content-Type': 'application/json'},
      })
    }

    const {stdout} = await runCommand('correspondents:list')
    expect(stdout.trim().split('\n')).to.deep.equal(['Acme', 'Umbrella Corp'])
    expect(requests).to.have.lengthOf(2)
  })

  it('respects page and page size flags', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          results: [{name: 'Page Two'}],
          next: 'https://paperless.example.test/api/correspondents/?page=3',
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        },
      )
    }

    const {stdout} = await runCommand('correspondents:list --page 2 --page-size 1')
    expect(stdout.trim()).to.equal('Page Two')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page')).to.equal('2')
    expect(requestUrl.searchParams.get('page_size')).to.equal('1')
  })

  it('respects page size without auto-pagination', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          results: [{name: 'First Five'}],
          next: 'https://paperless.example.test/api/correspondents/?page=2',
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        },
      )
    }

    const {stdout} = await runCommand('correspondents:list --page-size 5')
    expect(stdout.trim()).to.equal('First Five')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page_size')).to.equal('5')
  })
})
