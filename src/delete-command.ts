import {createInterface} from 'node:readline'

import {BaseCommand} from './base-command.js'

type DeleteCommandArgs = {
  id: number | string
}

type DeleteCommandFlags = {
  yes?: boolean
}

type DeleteCommandResult<TResponse> = null | TResponse | {deleted: true; id: number | string}

export abstract class DeleteCommand<TResponse = unknown> extends BaseCommand {
  protected deleteId(args: DeleteCommandArgs): number | string {
    return args.id
  }

  protected abstract deleteLabel(id: number | string): string

  protected deleteMessage(id: number | string, _result: null | TResponse): string | undefined {
    return `Deleted ${this.deleteLabel(id)}`
  }

  protected abstract deletePath(id: number | string): string

  protected async ensureConfirmed(flags: DeleteCommandFlags, id: number | string): Promise<void> {
    if (flags.yes) {
      return
    }

    if (!process.stdin.isTTY) {
      this.error('Confirmation required. Re-run with --yes to proceed.')
    }

    const rl = createInterface({input: process.stdin, output: process.stdout})
    const answer = await new Promise<string>((resolve) => {
      rl.question(`Delete ${this.deleteLabel(id)}? (y/N) `, (response) => resolve(response))
    })
    rl.close()
    const confirmed = ['y', 'yes'].includes(answer.trim().toLowerCase())

    if (!confirmed) {
      this.exit(0)
    }
  }

  public async run(): Promise<DeleteCommandResult<TResponse>> {
    const {args, flags, metadata} = await this.parse()
    const resolvedFlags = await this.resolveGlobalFlags(flags, metadata)
    const apiFlags = {
      headers: resolvedFlags.headers,
      hostname: resolvedFlags.hostname,
      token: resolvedFlags.token,
    }
    const deleteFlags = flags as DeleteCommandFlags
    const id = this.deleteId(args as DeleteCommandArgs)

    await this.ensureConfirmed(deleteFlags, id)

    const result = await this.deleteApiJson<TResponse>(apiFlags, this.deletePath(id))

    if (this.jsonEnabled()) {
      return result === null ? {deleted: true, id} : result
    }

    const message = this.deleteMessage(id, result)

    if (message) {
      this.log(message)
    }

    return result
  }
}
