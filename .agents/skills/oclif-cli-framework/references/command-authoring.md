# Command Authoring

## Command skeleton

```ts
import {Command, Flags, Args} from '@oclif/core'

export class MyCommand extends Command {
  static summary = 'Short overview of the command'
  static description = `
Detailed description.
Supports multiple lines.
`

  static examples = [
    '<%= config.bin %> <%= command.id %> --help',
    {
      description: 'Run with force',
      command: '<%= config.bin %> <%= command.id %> --force',
    },
  ]

  static flags = {
    force: Flags.boolean({char: 'f'}),
    file: Flags.string({required: true}),
  }

  static args = {
    target: Args.string({required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(MyCommand)
    this.log(`target=${args.target}, file=${flags.file}`)
  }
}
```

## Key command options

- `static summary`, `static description`, `static usage`, `static examples`
- `static hidden` to hide from help
- `static strict = false` to allow variable arg lengths and use `argv`
- `static aliases` for alternate command names
- `static enableJsonFlag = true` to add `--json` and return JSON from `run`

## Run lifecycle and timeout

- oclif terminates the process 10 seconds after `run()` resolves.
- Await any async work inside `run()` to avoid premature termination.

## Flags

- Use `Flags.boolean`, `Flags.string`, `Flags.integer`, `Flags.url`, `Flags.custom`, etc.
- Common flag options: `char`, `summary`, `description`, `default`, `required`, `multiple`, `options`, `env`, `aliases`.
- Relationships: `dependsOn`, `exclusive`, `exactlyOne`, `compatible`, or `relationships` for complex rules.
- Boolean flags can use `allowNo` to support `--no-<name>`.

## Args

- Use `Args.string`, `Args.integer`, `Args.boolean`, `Args.url`, `Args.file`, `Args.directory`, `Args.custom`.
- Args can read from stdin; set `ignoreStdin: true` to disable.

## Command helpers

- `this.log`, `this.warn`, `this.error`, `this.exit`, `this.logToStderr`
- `this.jsonEnabled()`, `this.toSuccessJson()`, `this.toErrorJson()`

Source docs: `commands.md`, `flags.md`, `args.md`.
