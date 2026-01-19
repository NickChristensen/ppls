import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {mkdtemp, readFile, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('config:set', () => {
  const originalConfigDir = process.env.PPLS_CONFIG_DIR
  let tempDir: string
  const loadOpts = {ignoreManifest: true, root: process.cwd()}

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'ppls-config-set-'))
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

  it('sets config values', async () => {
    const {stdout} = await runCommand('config:set hostname https://paperless.example.test --json', loadOpts)
    const payload = JSON.parse(stdout) as {hostname: string}

    expect(payload.hostname).to.equal('https://paperless.example.test')

    const configPath = path.join(tempDir, 'config.json')
    const contents = JSON.parse(await readFile(configPath, 'utf8')) as {hostname: string}
    expect(contents.hostname).to.equal('https://paperless.example.test')
  })

  it('accepts JSON values', async () => {
    const {stdout} = await runCommand("config:set headers '{\"X-Api-Key\":\"token\"}' --json", loadOpts)
    const payload = JSON.parse(stdout) as {headers: Record<string, string>}

    expect(payload.headers['X-Api-Key']).to.equal('token')
  })
})
