import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('config:init', () => {
  const originalConfigDir = process.env.PPLS_CONFIG_DIR
  let tempDir: string
  const loadOpts = {ignoreManifest: true, root: process.cwd()}

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'ppls-config-init-'))
    process.env.PPLS_CONFIG_DIR = tempDir
  })

  afterEach(async () => {
    if (originalConfigDir === undefined) {
      delete process.env.PPLS_CONFIG_DIR
    } else {
      process.env.PPLS_CONFIG_DIR = originalConfigDir
    }

    if (tempDir) {
      await rm(tempDir, {force: true, recursive: true})
    }
  })

  it('creates a config stub', async () => {
    const {stdout} = await runCommand('config:init --json', loadOpts)
    const payload = JSON.parse(stdout) as {overwritten: boolean; path: string}
    const configPath = path.join(tempDir, 'config.json')

    expect(payload.path).to.equal(configPath)
    expect(payload.overwritten).to.equal(false)

    const contents = JSON.parse(await readFile(configPath, 'utf8')) as Record<string, unknown>
    expect(contents).to.deep.equal({
      dateFormat: 'YYYY-MM-DD',
      headers: {
        'Custom-Header': 'value',
      },
      hostname: 'http://example.com',
      token: 'your-api-token-here',
    })
  })

  it('refuses to overwrite without --force', async () => {
    const configPath = path.join(tempDir, 'config.json')
    await writeFile(configPath, JSON.stringify({hostname: 'https://paperless.example.test'}, null, 2))

    const {error} = await runCommand('config:init', loadOpts)

    expect(error).to.be.instanceOf(Error)
    expect(error?.message).to.contain('Config already exists')
  })
})
