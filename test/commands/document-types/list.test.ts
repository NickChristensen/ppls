import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('document-types:list', () => {
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

  it('lists document types across pages by default', async () => {
    const responses = [
      {
        body: {
          next: '/api/document_types/?page=2',
          results: [{'document_count': 2, id: 1, name: 'Bill', slug: 'bill'}],
        },
        status: 200,
      },
      {
        body: {
          next: null,
          results: [{'document_count': 5, id: 2, name: 'Receipt', slug: 'receipt'}],
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

    const {stdout} = await runCommand('document-types:list')
    expect(stdout).to.contain('Name')
    expect(stdout).to.contain('Bill')
    expect(stdout).to.contain('Receipt')
    expect(requests).to.have.lengthOf(2)
  })

  it('respects page and page size flags', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/document_types/?page=3',
          results: [{'document_count': 1, id: 2, name: 'Page Two', slug: 'page-two'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('document-types:list --page 2 --page-size 1')
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

    await runCommand('document-types:list --sort name')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('ordering')).to.equal('name')
  })

  it('respects page size without auto-pagination', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(
        JSON.stringify({
          next: 'https://paperless.example.test/api/document_types/?page=2',
          results: [{'document_count': 3, id: 3, name: 'First Five', slug: 'first-five'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand('document-types:list --page-size 5')
    expect(stdout).to.contain('First Five')
    expect(requests).to.have.lengthOf(1)

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('page_size')).to.equal('5')
  })

  it('returns the payload when json is enabled', async () => {
    const responses = [
      {
        body: {
          next: 'https://paperless.example.test/api/document_types/?page=2',
          results: [{name: 'Bill'}],
        },
        status: 200,
      },
      {
        body: {
          next: null,
          results: [{name: 'Receipt'}],
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

    const {stdout} = await runCommand('document-types:list --json')
    const payload = JSON.parse(stdout) as Array<{name: string}>

    expect(payload.map((item) => item.name)).to.deep.equal(['Bill', 'Receipt'])
  })

  it('renders a plain list when requested', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          next: null,
          results: [{'document_count': 1, id: 10, name: 'Bill', slug: 'bill'}],
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('document-types:list --plain')
    expect(stdout.trim()).to.equal('[10] Bill (1 document)')
  })
})
