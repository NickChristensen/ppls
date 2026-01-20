import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'

export type ConfigData = Record<string, unknown>

export const configPath = (configDir: string): string => path.join(configDir, 'config.json')

export const readConfig = async (configDir: string): Promise<ConfigData> => {
  const configFile = configPath(configDir)
  let rawConfig: string

  try {
    rawConfig = await readFile(configFile, 'utf8')
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException

    if (typedError.code === 'ENOENT') {
      return {}
    }

    const message = typedError.message ?? String(error)
    throw new Error(`Failed to read config at ${configFile}: ${message}`)
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(rawConfig)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to read config at ${configFile}: ${message}`)
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Config at ${configFile} must be a JSON object.`)
  }

  return parsed as ConfigData
}

export const writeConfig = async (configDir: string, config: ConfigData): Promise<void> => {
  const configFile = configPath(configDir)
  await mkdir(configDir, {recursive: true})
  await writeFile(configFile, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
}
