# Config, Topics, and Plugins

## Config locations

- `package.json` under `oclif` or an rc file at repo root.
- Supported rc filenames: `.oclifrc`, `.oclifrc.json`, `.oclifrc.js`, `.oclifrc.mjs`, `.oclifrc.cjs`, `oclif.config.js`, `oclif.config.mjs`, `oclif.config.cjs`.

## Key configuration fields

- `bin`: CLI executable name.
- `dirname`: base directory for config/cache/data.
- `commands`: path to compiled command classes.
- `topicSeparator`: only `:` or space are supported.
- `topics`: explicit topic descriptions.
- `plugins`, `devPlugins`, `jitPlugins`: plugin loading.
- `hooks`: hook registrations.
- `helpClass`, `helpOptions`: help customization.
- `exitCodes`: configure exit codes for parsing/validation errors.
- `flexibleTaxonomy`: enable flexible taxonomy.
- `theme`, `state`: display or styling info.
- `macos`, `windows`: installer settings.

## Topics

- Create topics by nesting directories inside `src/commands`.
- Topic description comes from the first command in the directory unless overridden in `oclif.topics`.
- Avoid more than 1-2 levels of subtopics for usability.

## Plugins

- Add plugins to dependencies and list them under `oclif.plugins`.
- Minimatch patterns are supported (e.g., `"@oclif/plugin-*"`).
- For user-installed plugins, include `@oclif/plugin-plugins`.
- Common plugins: help, not-found, update, plugins, autocomplete, version, commands, warn-if-update-available.

Source docs: `configuring_your_cli.md`, `topics.md`, `plugins.md`.
