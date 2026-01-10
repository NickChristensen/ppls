ppls
=================

A node-based paperless-ngx cli


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ppls.svg)](https://npmjs.org/package/ppls)
[![Downloads/week](https://img.shields.io/npm/dw/ppls.svg)](https://npmjs.org/package/ppls)


<!-- toc -->
* [Usage](#usage)
* [Configuration](#configuration)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ppls
$ ppls COMMAND
running command...
$ ppls (--version)
ppls/0.0.0 darwin-arm64 node-v25.2.1
$ ppls --help [COMMAND]
USAGE
  $ ppls COMMAND
...
```
<!-- usagestop -->
# Configuration

Set the following environment variables before running the CLI (they are used as defaults for `--hostname` and `--token` flags):

- `PPLS_HOSTNAME`: Base URL for your paperless-ngx instance (for example, `https://paperless.example.com`)
- `PPLS_TOKEN`: API token for your paperless-ngx user

# Commands
<!-- commands -->
* [`ppls correspondents list`](#ppls-correspondents-list)
* [`ppls help [COMMAND]`](#ppls-help-command)
* [`ppls plugins`](#ppls-plugins)
* [`ppls plugins add PLUGIN`](#ppls-plugins-add-plugin)
* [`ppls plugins:inspect PLUGIN...`](#ppls-pluginsinspect-plugin)
* [`ppls plugins install PLUGIN`](#ppls-plugins-install-plugin)
* [`ppls plugins link PATH`](#ppls-plugins-link-path)
* [`ppls plugins remove [PLUGIN]`](#ppls-plugins-remove-plugin)
* [`ppls plugins reset`](#ppls-plugins-reset)
* [`ppls plugins uninstall [PLUGIN]`](#ppls-plugins-uninstall-plugin)
* [`ppls plugins unlink [PLUGIN]`](#ppls-plugins-unlink-plugin)
* [`ppls plugins update`](#ppls-plugins-update)

## `ppls correspondents list`

List correspondents

```
USAGE
  $ ppls correspondents list --hostname <value> --token <value> [--json] [--table] [--page <value>] [--page-size
  <value>]

FLAGS
  --hostname=<value>   (required) [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --page=<value>       Page number to fetch
  --page-size=<value>  Number of results per page
  --table              Output as a table
  --token=<value>      (required) [env: PPLS_TOKEN] Paperless-ngx API token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List correspondents

EXAMPLES
  $ ppls correspondents list
```

_See code: [src/commands/correspondents/list.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/correspondents/list.ts)_

## `ppls help [COMMAND]`

Display help for ppls.

```
USAGE
  $ ppls help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ppls.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.36/src/commands/help.ts)_

## `ppls plugins`

List installed plugins.

```
USAGE
  $ ppls plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ppls plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/index.ts)_

## `ppls plugins add PLUGIN`

Installs a plugin into ppls.

```
USAGE
  $ ppls plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ppls.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PPLS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PPLS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ppls plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ppls plugins add myplugin

  Install a plugin from a github url.

    $ ppls plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ppls plugins add someuser/someplugin
```

## `ppls plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ppls plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ppls plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/inspect.ts)_

## `ppls plugins install PLUGIN`

Installs a plugin into ppls.

```
USAGE
  $ ppls plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ppls.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PPLS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PPLS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ppls plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ppls plugins install myplugin

  Install a plugin from a github url.

    $ ppls plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ppls plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/install.ts)_

## `ppls plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ppls plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ppls plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/link.ts)_

## `ppls plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ppls plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ppls plugins unlink
  $ ppls plugins remove

EXAMPLES
  $ ppls plugins remove myplugin
```

## `ppls plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ppls plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/reset.ts)_

## `ppls plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ppls plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ppls plugins unlink
  $ ppls plugins remove

EXAMPLES
  $ ppls plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/uninstall.ts)_

## `ppls plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ppls plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ppls plugins unlink
  $ ppls plugins remove

EXAMPLES
  $ ppls plugins unlink myplugin
```

## `ppls plugins update`

Update installed plugins.

```
USAGE
  $ ppls plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/update.ts)_
<!-- commandsstop -->
