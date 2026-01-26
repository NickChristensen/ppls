import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('tags:list', () => {
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

  it('requests a single page with the default page size', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'http://paperless.example.test/api/tags/?page=2',
          results: [{children: [], 'document_count': 2, id: 1, name: 'Inbox', slug: 'inbox'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('tags:list')
    expect(stdout).to.contain('Name')
    expect(stdout).to.contain('Inbox')
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
          next: 'https://paperless.example.test/api/tags/?page=3',
          results: [{children: [], 'document_count': 1, id: 2, name: 'Page Two', slug: 'page-two'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('tags:list --page 2 --page-size 1')
    expect(stdout).to.contain('Page Two')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page')).to.equal('2')
    expect(requestUrl.searchParams.get('page_size')).to.equal('1')
  })

  it('requires page size when page is provided', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('tags:list --page 2')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.match(/page-size/i)
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

    await runCommand('tags:list --sort name')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('ordering')).to.equal('name')
  })

  it('respects page size overrides', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/tags/?page=2',
          results: [{children: [], 'document_count': 3, id: 3, name: 'First Five', slug: 'first-five'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('tags:list --page-size 5')
    expect(stdout).to.contain('First Five')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page_size')).to.equal('5')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/tags/?page=2',
          results: [{children: [], name: 'Inbox'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('tags:list --json')
    const payload = JSON.parse(stdout) as Array<{name: string}>

    expect(payload.map((item) => item.name)).to.deep.equal(['Inbox'])
  })

  it('renders a plain list when requested', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: null,
          results: [{children: [], 'document_count': 1, id: 10, name: 'Inbox', slug: 'inbox'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('tags:list --plain')
    expect(stdout.trim()).to.equal('[10] Inbox (1 document)')
  })
})
