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
* [`ppls correspondents show ID`](#ppls-correspondents-show-id)
* [`ppls help [COMMAND]`](#ppls-help-command)
* [`ppls tags list`](#ppls-tags-list)
* [`ppls tags show ID`](#ppls-tags-show-id)

## `ppls correspondents list`

List correspondents

```
USAGE
  $ ppls correspondents list --hostname <value> --token <value> [--plain | --json | --table] [--sort <value>] [--page
    <value>] [--page-size <value>]

FLAGS
  --hostname=<value>   (required) [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --page=<value>       Page number to fetch
  --page-size=<value>  Number of results per page
  --plain              Output as plain text
  --sort=<value>       Sort results by the provided field
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

## `ppls correspondents show ID`

Show correspondent details

```
USAGE
  $ ppls correspondents show ID --hostname <value> --token <value> [--plain | --json | --table] [--sort <value>]

ARGUMENTS
  ID  Correspondent id

FLAGS
  --hostname=<value>  (required) [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --plain             Output as plain text
  --sort=<value>      Sort results by the provided field
  --table             Output as a table
  --token=<value>     (required) [env: PPLS_TOKEN] Paperless-ngx API token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Show correspondent details

EXAMPLES
  $ ppls correspondents show 123
```

_See code: [src/commands/correspondents/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/correspondents/show.ts)_

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

## `ppls tags list`

List tags

```
USAGE
  $ ppls tags list --hostname <value> --token <value> [--plain | --json | --table] [--sort <value>] [--page
    <value>] [--page-size <value>]

FLAGS
  --hostname=<value>   (required) [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --page=<value>       Page number to fetch
  --page-size=<value>  Number of results per page
  --plain              Output as plain text
  --sort=<value>       Sort results by the provided field
  --table              Output as a table
  --token=<value>      (required) [env: PPLS_TOKEN] Paperless-ngx API token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List tags

EXAMPLES
  $ ppls tags list
```

_See code: [src/commands/tags/list.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/tags/list.ts)_

## `ppls tags show ID`

Show tag details

```
USAGE
  $ ppls tags show ID --hostname <value> --token <value> [--plain | --json | --table] [--sort <value>]

ARGUMENTS
  ID  Tag id

FLAGS
  --hostname=<value>  (required) [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --plain             Output as plain text
  --sort=<value>      Sort results by the provided field
  --table             Output as a table
  --token=<value>     (required) [env: PPLS_TOKEN] Paperless-ngx API token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Show tag details

EXAMPLES
  $ ppls tags show 123
```

_See code: [src/commands/tags/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/tags/show.ts)_
<!-- commandsstop -->
