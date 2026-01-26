import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('documents:list', () => {
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
          next: '/api/documents/?page=2',
          results: [
            {added: '2024-01-02T01:02:03Z', correspondent: 1, created: '2024-01-01', 'document_type': 2, id: 1, title: 'First Doc'},
          ],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('documents:list')
    const normalized = stdout.replaceAll(/\s+/g, ' ')
    expect(normalized).to.contain('Title')
    expect(normalized).to.contain('First')
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
          next: 'https://paperless.example.test/api/documents/?page=3',
          results: [
            {added: '2024-01-02T01:02:03Z', correspondent: 1, created: '2024-01-01', 'document_type': 2, id: 2, title: 'Page Two'},
          ],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('documents:list --page 2 --page-size 1')
    const normalized = stdout.replaceAll(/\s+/g, ' ')
    expect(normalized).to.contain('Page')
    expect(normalized).to.contain('Two')
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
          results: [{title: 'Alpha'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    await runCommand('documents:list --sort title')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('ordering')).to.equal('title')
  })

  it('supports name-contains filtering', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: null,
          results: [{title: 'BFPR100'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    await runCommand('documents:list --name-contains BFPR100')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('title__icontains')).to.equal('BFPR100')
  })

  it('respects page size overrides', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/documents/?page=2',
          results: [
            {added: '2024-01-02T01:02:03Z', correspondent: 1, created: '2024-01-01', 'document_type': 2, id: 3, title: 'First Five'},
          ],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('documents:list --page-size 5')
    const normalized = stdout.replaceAll(/\s+/g, ' ')
    expect(normalized).to.contain('First')
    expect(normalized).to.contain('Five')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page_size')).to.equal('5')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/documents/?page=2',
          results: [{title: 'First Doc'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('documents:list --json')
    const payload = JSON.parse(stdout) as Array<{title: string}>

    expect(payload.map((item) => item.title)).to.deep.equal(['First Doc'])
  })

  it('renders a plain list when requested', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: null,
          results: [
            {added: '2024-01-02T01:02:03Z', correspondent: 1, created: '2024-01-01', 'document_type': 2, id: 10, title: 'First Doc'},
          ],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('documents:list --plain')
    expect(stdout.trim()).to.equal('[10] First Doc')
  })
})
