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
        body: {
          next: '/api/correspondents/?page=2',
          results: [{name: 'Acme'}],
        },
        status: 200,
      },
      {
        body: {
          next: null,
          results: [{name: 'Umbrella Corp'}],
        },
        status: 200,
      },
    ]

    globalThis.fetch = async (input) => {
      requests.push(String(input))
      const response = responses.shift()

      if (!response) {
        throw new Error('Unexpected fetch call')
      }

      return new Response(JSON.stringify(response.body), {
        headers: {'Content-Type': 'application/json'},
        status: response.status,
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
          next: 'https://paperless.example.test/api/correspondents/?page=3',
          results: [{name: 'Page Two'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
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

  it('supports sort ordering', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: null,
          results: [{name: 'Alpha'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    await runCommand('correspondents:list --sort name')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('ordering')).to.equal('name')
  })

  it('respects page size without auto-pagination', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/correspondents/?page=2',
          results: [{name: 'First Five'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('correspondents:list --page-size 5')
    expect(stdout.trim()).to.equal('First Five')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page_size')).to.equal('5')
  })

  it('returns the payload when json is enabled', async () => {
    const responses = [
      {
        body: {
          next: 'https://paperless.example.test/api/correspondents/?page=2',
          results: [{name: 'Acme'}],
        },
        status: 200,
      },
      {
        body: {
          next: null,
          results: [{name: 'Umbrella Corp'}],
        },
        status: 200,
      },
    ]

    globalThis.fetch = async () => {
      const response = responses.shift()

      if (!response) {
        throw new Error('Unexpected fetch call')
      }

      return new Response(JSON.stringify(response.body), {
        headers: {'Content-Type': 'application/json'},
        status: response.status,
      })
    }

    const {stdout} = await runCommand('correspondents:list --json')
    const payload = JSON.parse(stdout) as {results: Array<{name: string}>}

    expect(payload.results.map((item) => item.name)).to.deep.equal(['Acme', 'Umbrella Corp'])
  })

  it('renders a table when requested', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: null,
          results: [{name: 'Acme'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('correspondents:list --table')
    expect(stdout).to.contain('Name')
    expect(stdout).to.contain('Acme')
  })
})
