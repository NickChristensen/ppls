import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {mkdtemp, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'

describe('config:remove', () => {
  const originalConfigDir = process.env.PPLS_CONFIG_DIR
  let tempDir: string
  const loadOpts = {ignoreManifest: true, root: process.cwd()}

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'ppls-config-remove-'))
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

  it('removes config values', async () => {
    const configPath = path.join(tempDir, 'config.json')
    await writeFile(configPath, JSON.stringify({hostname: 'https://paperless.example.test'}, null, 2), 'utf8')

    const {stdout} = await runCommand('config:remove hostname --json', loadOpts)
    const payload = JSON.parse(stdout) as Record<string, unknown>

    expect(payload.hostname).to.equal(undefined)
  })
})
