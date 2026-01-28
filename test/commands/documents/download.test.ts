import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {mkdir, mkdtemp, readFile, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('documents:download', () => {
  const originalEnv = {
    hostname: process.env.PPLS_HOSTNAME,
    token: process.env.PPLS_TOKEN,
  }
  const originalFetch = globalThis.fetch
  let tempDir: string
  let originalCwd: string
  let requests: string[] = []

  beforeEach(async () => {
    process.env.PPLS_HOSTNAME = 'https://paperless.example.test'
    process.env.PPLS_TOKEN = 'test-token'
    requests = []
    tempDir = await mkdtemp(path.join(tmpdir(), 'ppls-documents-download-'))
    originalCwd = process.cwd()
    process.chdir(tempDir)
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

    if (originalCwd) {
      process.chdir(originalCwd)
    }

    if (tempDir) {
      await rm(tempDir, {force: true, recursive: true})
    }
  })

  it('downloads with the default filename', async () => {
    globalThis.fetch = async () =>
      new Response(new TextEncoder().encode('hello'), {
        headers: {
          'Content-Disposition': 'attachment; filename="report.pdf"',
          'Content-Type': 'application/pdf',
        },
        status: 200,
      })

    const {stdout} = await runCommand('documents:download 12')
    const outputPath = path.join(process.cwd(), 'report.pdf')

    expect(stdout.trim()).to.equal(`Saved ${outputPath}`)
    const contents = await readFile(outputPath, 'utf8')
    expect(contents).to.equal('hello')
  })

  it('supports original downloads and custom output paths', async () => {
    globalThis.fetch = async (input) => {
      requests.push(String(input))
      return new Response(new TextEncoder().encode('data'), {
        headers: {'Content-Type': 'application/pdf'},
        status: 200,
      })
    }

    const outputPath = path.join(tempDir, 'custom.pdf')
    const {stdout} = await runCommand(`documents:download 33 --original --output ${outputPath} --json`)
    const payload = JSON.parse(stdout) as {filename: string; output: string}
    const url = new URL(requests[0])

    expect(url.searchParams.get('original')).to.equal('true')
    expect(payload.output).to.equal(outputPath)
    expect(payload.filename).to.equal('custom.pdf')
    const contents = await readFile(outputPath, 'utf8')
    expect(contents).to.equal('data')
  })

  it('downloads multiple documents to an output directory', async () => {
    const outputDir = path.join(tempDir, 'downloads')
    await mkdir(outputDir)

    globalThis.fetch = async (input) => {
      requests.push(String(input))
      const idMatch = /\/documents\/(\d+)\/download/.exec(String(input))
      const id = idMatch ? idMatch[1] : 'unknown'
      return new Response(new TextEncoder().encode(`data-${id}`), {
        headers: {'Content-Disposition': `attachment; filename="doc-${id}.pdf"`},
        status: 200,
      })
    }

    const {stdout} = await runCommand(`documents:download 12,34 --output-dir ${outputDir} --json`)
    const payload = JSON.parse(stdout) as Array<{filename: string; output: string}>

    expect(payload).to.have.length(2)
    expect(payload[0]?.output).to.equal(path.join(outputDir, 'doc-12.pdf'))
    expect(payload[1]?.output).to.equal(path.join(outputDir, 'doc-34.pdf'))

    const contents12 = await readFile(path.join(outputDir, 'doc-12.pdf'), 'utf8')
    const contents34 = await readFile(path.join(outputDir, 'doc-34.pdf'), 'utf8')

    expect(contents12).to.equal('data-12')
    expect(contents34).to.equal('data-34')
  })

  it('rejects escaped delimiters that yield non-numeric ids', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand(String.raw`documents:download 12\,34`)

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('Invalid document id: 12,34')
  })

  it('rejects empty comma-separated input', async () => {
    globalThis.fetch = async () => {
      throw new Error('Unexpected fetch call')
    }

    const {error} = await runCommand('documents:download ","')

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('Provide at least one document id.')
  })
})
