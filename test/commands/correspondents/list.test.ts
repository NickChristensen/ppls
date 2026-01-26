import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('correspondents:list', () => {
  const originalEnv = {
    headers: process.env.PPLS_HEADERS,
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

    if (originalEnv.headers === undefined) {
      delete process.env.PPLS_HEADERS
    } else {
      process.env.PPLS_HEADERS = originalEnv.headers
    }

    globalThis.fetch = originalFetch
  })

  it('requests a single page with the default page size', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: '/api/correspondents/?page=2',
          results: [{'document_count': 2, id: 1, name: 'Acme', slug: 'acme'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('correspondents:list')
    expect(stdout).to.contain('Name')
    expect(stdout).to.contain('Acme')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page')).to.equal(null)
    expect(requestUrl.searchParams.get('page_size')).to.equal(String(Number.MAX_SAFE_INTEGER))
  })

  it('respects page and page size flags', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/correspondents/?page=3',
          results: [{'document_count': 1, id: 2, name: 'Page Two', slug: 'page-two'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('correspondents:list --page 2 --page-size 1')
    expect(stdout).to.contain('Page Two')
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

  it('rejects non-positive page values', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('correspondents:list --page 0 --page-size 1')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.match(/greater than or equal to 1/i)
  })

  it('rejects non-positive page size values', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('correspondents:list --page-size 0')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.match(/greater than or equal to 1/i)
  })

  it('supports id and name filters', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: null,
          results: [],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {error} = await runCommand('correspondents:list --id-in 1,2,3 --name-contains bank')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('cannot also be provided')
  })

  it('includes custom headers from env and flags', async () => {
    process.env.PPLS_HEADERS = 'X-Env=from-env'

    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      const headers = new Headers(init?.headers)
      expect(headers.get('Accept')).to.equal('application/json')
      expect(headers.get('Authorization')).to.equal('Token test-token')
      expect(headers.get('X-Env')).to.equal('from-env')
      expect(headers.get('X-Flag')).to.equal('from-flag')

      return new Response(
        JSON.stringify({
          next: null,
          results: [{name: 'Headers'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    await runCommand('correspondents:list --header X-Flag=from-flag --page-size 1')
    expect(requests).to.have.lengthOf(1)
  })

  it('respects page size overrides', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/correspondents/?page=2',
          results: [{'document_count': 3, id: 3, name: 'First Five', slug: 'first-five'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('correspondents:list --page-size 5')
    expect(stdout).to.contain('First Five')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page_size')).to.equal('5')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/correspondents/?page=2',
          results: [{name: 'Acme'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('correspondents:list --json')
    const payload = JSON.parse(stdout) as Array<{name: string}>

    expect(payload.map((item) => item.name)).to.deep.equal(['Acme'])
  })

  it('renders a plain list when requested', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: null,
          results: [{'document_count': 1, id: 10, name: 'Acme', slug: 'acme'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('correspondents:list --plain')
    expect(stdout.trim()).to.equal('[10] Acme (1 document)')
  })
})
