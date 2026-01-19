import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('documents:update', () => {
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

  it('updates a document', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      const body = JSON.parse(init?.body as string) as Record<string, unknown>
      expect(body).to.deep.equal({
        'archive_serial_number': 123,
        content: 'Extracted-text',
        correspondent: 7,
        created: '2024-01-01',
        'document_type': 4,
        'storage_path': 2,
        tags: [1, 2],
        title: 'Receipt',
      })
      expect(init?.method).to.equal('PATCH')

      return new Response(
        JSON.stringify({
          added: '2024-01-01T10:00:00Z',
          correspondent: 7,
          created: '2024-01-01',
          'document_type': 4,
          id: 101,
          'storage_path': 2,
          tags: [1, 2],
          title: 'Receipt',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )
    }

    const {stdout} = await runCommand(
      [
        'documents:update',
        '101',
        '--title',
        'Receipt',
        '--correspondent',
        '7',
        '--document-type',
        '4',
        '--storage-path',
        '2',
        '--tag',
        '1',
        '--tag',
        '2',
        '--created',
        '2024-01-01',
        '--content',
        'Extracted-text',
        '--archive-serial-number',
        '123',
        '--plain',
      ].join(' '),
    )

    expect(stdout.trim()).to.equal('[101] Receipt')
    expect(new URL(requests[0]).pathname).to.equal('/api/documents/101/')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          added: '2024-01-01T10:00:00Z',
          correspondent: 7,
          created: '2024-01-01',
          'document_type': 4,
          id: 42,
          'storage_path': 2,
          tags: [1, 2],
          title: 'Receipt',
        }),
        {
          headers: {'Content-Type': 'application/json'},
          status: 200,
        },
      )

    const {stdout} = await runCommand('documents:update 42 --title Receipt --json')
    const payload = JSON.parse(stdout) as {title: string}

    expect(payload.title).to.equal('Receipt')
  })
})
