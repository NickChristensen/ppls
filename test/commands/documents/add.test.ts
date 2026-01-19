import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {mkdtemp, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('documents:add', () => {
  const originalEnv = {
    hostname: process.env.PPLS_HOSTNAME,
    token: process.env.PPLS_TOKEN,
  }
  const originalFetch = globalThis.fetch
  let requests: string[] = []
  let tempDir: string
  let tempFile: string

  beforeEach(async () => {
    process.env.PPLS_HOSTNAME = 'https://paperless.example.test'
    process.env.PPLS_TOKEN = 'test-token'
    requests = []
    tempDir = await mkdtemp(path.join(tmpdir(), 'ppls-documents-add-'))
    tempFile = path.join(tempDir, 'sample.txt')
    await writeFile(tempFile, 'document contents')
  })

  afterEach(async () => {
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
    if (tempDir) {
      await rm(tempDir, {force: true, recursive: true})
    }
  })

  it('uploads a document', async () => {
    globalThis.fetch = async (input, init) => {
      requests.push(String(input))
      expect(init?.method).to.equal('POST')
      const body = init?.body as FormData
      expect(body).to.be.instanceOf(FormData)
      expect(body.get('title')).to.equal('Receipt')
      expect(body.get('correspondent')).to.equal('7')
      expect(body.get('document_type')).to.equal('4')
      expect(body.get('storage_path')).to.equal('2')
      expect(body.get('created')).to.equal('2024-01-01T10:00:00Z')
      expect(body.get('archive_serial_number')).to.equal('123')
      expect(body.getAll('tags')).to.deep.equal(['1', '2'])
      expect(body.get('document')).to.be.instanceOf(Blob)

      return new Response(JSON.stringify('queued'), {
        headers: {'Content-Type': 'application/json'},
        status: 200,
      })
    }

    const {stdout} = await runCommand(
      [
        'documents:add',
        tempFile,
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
        '2024-01-01T10:00:00Z',
        '--archive-serial-number',
        '123',
        '--plain',
      ].join(' '),
    )

    expect(stdout.trim()).to.equal('queued')
    expect(new URL(requests[0]).pathname).to.equal('/api/documents/post_document/')
  })

  it('returns the payload when json is enabled', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({'task_id': 'abc123'}), {
        headers: {'Content-Type': 'application/json'},
        status: 200,
      })

    const {stdout} = await runCommand(`documents:add ${tempFile} --json`)
    const payload = JSON.parse(stdout) as {task_id: string}

    expect(payload.task_id).to.equal('abc123')
  })
})
