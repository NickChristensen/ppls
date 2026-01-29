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

  it('supports added/created/modified date filters', async () => {
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

    await runCommand([
      'documents:list',
      '--added-after',
      '2024-01-01',
      '--added-before',
      '2024-01-31',
      '--created-after',
      '2024-02-01T02:03:04Z',
      '--created-before',
      '2024-02-28T00:00:00Z',
      '--modified-after',
      '2024-03-01',
      '--modified-before',
      '2024-03-31T23:59:59Z',
    ])

    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('added__date__gte')).to.equal('2024-01-01')
    expect(requestUrl.searchParams.get('added__date__lte')).to.equal('2024-01-31')
    expect(requestUrl.searchParams.get('created__gte')).to.equal('2024-02-01T02:03:04Z')
    expect(requestUrl.searchParams.get('created__lte')).to.equal('2024-02-28T00:00:00Z')
    expect(requestUrl.searchParams.get('modified__date__gte')).to.equal('2024-03-01')
    expect(requestUrl.searchParams.get('modified__lte')).to.equal('2024-03-31T23:59:59Z')
  })

  it('supports tag filters', async () => {
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

    await runCommand('documents:list --tag 1,2 --tag-all 3,4 --tag-not 5')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('tags__id__in')).to.equal('1,2')
    expect(requestUrl.searchParams.get('tags__id__all')).to.equal('3,4')
    expect(requestUrl.searchParams.get('tags__id__none')).to.equal('5')
  })

  it('supports no-tag filtering', async () => {
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

    await runCommand('documents:list --no-tag')
    const requestUrl = new URL(requests[0])
    expect(requestUrl.searchParams.get('is_tagged')).to.equal('false')
  })

  it('supports correspondent and document type filters', async () => {
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

    await runCommand(
      'documents:list --correspondent 12,13 --correspondent-not 8 --document-type 4,5 --document-type-not 6',
    )
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('correspondent__id__in')).to.equal('12,13')
    expect(requestUrl.searchParams.get('correspondent__id__none')).to.equal('8')
    expect(requestUrl.searchParams.get('document_type__id__in')).to.equal('4,5')
    expect(requestUrl.searchParams.get('document_type__id__none')).to.equal('6')
  })

  it('supports no-correspondent and no-document-type filters', async () => {
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

    await runCommand('documents:list --no-correspondent --no-document-type')
    const requestUrl = new URL(requests[0])

    expect(requestUrl.searchParams.get('correspondent__isnull')).to.equal('true')
    expect(requestUrl.searchParams.get('document_type__isnull')).to.equal('true')
  })

  it('rejects invalid date filters', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('documents:list --added-after not-a-date')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.match(/YYYY-MM-DD|ISO 8601/i)
  })

  it('rejects id-in with tag filters', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('documents:list --id-in 1,2 --tag 3')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('cannot also be provided')
  })

  it('rejects no-tag with tag filters', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('documents:list --no-tag --tag 1')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('cannot also be provided')
  })

  it('rejects no-correspondent with correspondent filters', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('documents:list --no-correspondent --correspondent 1')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('cannot also be provided')
  })

  it('rejects no-document-type with document type filters', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('documents:list --no-document-type --document-type 1')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('cannot also be provided')
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
