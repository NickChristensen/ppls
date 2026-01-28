# Project Generation and Templates

## Create a new CLI

- Use `oclif generate <name>` to scaffold a new TypeScript CLI.
- The generator prompts for module type (ESM or CommonJS), npm package name, bin name, author, license, repo info, and package manager.
- Use `--yes` to accept defaults and override individual answers with flags like `--module-type`, `--author`, `--name`, `--bin`, and `--package-manager`.

Example:

```sh
oclif generate mycli --module-type ESM --author "Jane Doe" --yes
```

## Initialize oclif in an existing project

- Use `oclif init` to add oclif to an existing repo.
- This adds bin scripts (`bin/run.js`, `bin/run.cmd`, `bin/dev.js`, `bin/dev.cmd`), `@oclif/core` and `ts-node` dependencies, and an `oclif` config section in `package.json` with `bin`, `dirname`, `commands`, and `topicSeparator`.

## Add commands or hooks

- Add a command: `oclif generate command <name>` (defaults to `src/commands`).
- Add a hook: `oclif generate hook <name> --event <event>`.

## Templates and bin scripts

- Generated CLIs include `bin/dev.js` (development) and `bin/run.js` (production) plus Windows `.cmd` variants.
- `dev` scripts run TypeScript via `ts-node` (or another runtime like `tsx` or `bun`).
- Template projects include sample commands (`hello`, `hello world`) and example tests using `@oclif/test` + `mocha`.

## Requirements

- oclif supports Node LTS releases only.

Source docs: `introduction.md`, `generator_commands.md`, `templates.md`.
