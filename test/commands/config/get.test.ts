import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {mkdtemp, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('config:get', () => {
  const originalConfigDir = process.env.PPLS_CONFIG_DIR
  let tempDir: string
  const loadOpts = {ignoreManifest: true, root: process.cwd()}

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'ppls-config-get-'))
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

  it('gets a config value', async () => {
    const configPath = path.join(tempDir, 'config.json')
    await writeFile(configPath, JSON.stringify({hostname: 'https://paperless.example.test'}, null, 2), 'utf8')

    const {stdout} = await runCommand('config:get hostname', loadOpts)

    expect(stdout.trim()).to.equal('https://paperless.example.test')
  })

  it('returns the value in json', async () => {
    const configPath = path.join(tempDir, 'config.json')
    await writeFile(configPath, JSON.stringify({token: 'token'}, null, 2), 'utf8')

    const {stdout} = await runCommand('config:get token --json', loadOpts)
    const payload = JSON.parse(stdout) as {token: string}

    expect(payload.token).to.equal('token')
  })
})
