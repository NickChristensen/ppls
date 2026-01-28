# Hooks, Testing, and Release

## Hooks

- Hooks are functions exported as default and registered in `oclif.hooks`.
- Hooks are run in parallel (this behavior may change).
- Supported lifecycle events: `init`, `prerun`, `command_not_found`, `command_incomplete` (flexible taxonomy), `jit_plugin_not_installed`, `preparse` (root CLI only), `postrun`, `finally`.
- For custom events, register a hook and call `this.config.runHook('event', payload)` from a command.
- To exit from a hook, use `options.context.error()` or `options.context.exit()` (throwing does not exit).

## Testing

- `@oclif/test` provides `runCommand()` and test helpers.
- `mocha` and example tests are included in generated CLIs.
- For HTTP calls, `nock` is a common choice for mocking.
- If using Vitest, set `disableConsoleIntercept: true` to allow `runCommand()` to capture stdout/stderr.

## Release

- npm: `npm version (major|minor|patch)` then `npm publish`.
- Standalone tarballs: `oclif pack tarballs` + upload via `oclif upload tarballs` to S3.
- Use `oclif promote` to move versions between release channels (e.g., `stable`, `stable-rc`).
- Autoupdate uses `@oclif/plugin-update` and `oclif.update.s3.*` config; host can be non-S3 if it serves the same layout.
- Channels use semver prerelease tags (`1.0.0-beta`).
- Installers: `oclif pack win`, `oclif pack macos`, `oclif pack deb` with corresponding `oclif upload` and `oclif promote`.
- Brew formulae must set `CLI_NAME_OCLIF_CLIENT_HOME` for updates to work.

Source docs: `hooks.md`, `testing.md`, `releasing.md`.
