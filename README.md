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
* [`ppls custom-fields add NAME`](#ppls-custom-fields-add-name)
* [`ppls custom-fields list`](#ppls-custom-fields-list)
* [`ppls custom-fields show ID`](#ppls-custom-fields-show-id)
* [`ppls document-types add NAME`](#ppls-document-types-add-name)
* [`ppls document-types list`](#ppls-document-types-list)
* [`ppls document-types show ID`](#ppls-document-types-show-id)
* [`ppls documents list`](#ppls-documents-list)
* [`ppls documents show ID`](#ppls-documents-show-id)
* [`ppls help [COMMAND]`](#ppls-help-command)
* [`ppls profile`](#ppls-profile)
* [`ppls tags add NAME`](#ppls-tags-add-name)
* [`ppls tags list`](#ppls-tags-list)
* [`ppls tags show ID`](#ppls-tags-show-id)
* [`ppls whoami`](#ppls-whoami)

## `ppls correspondents list`

List correspondents

```
USAGE
  $ ppls correspondents list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> |
    --name-contains <value>]

FLAGS
  --id-in=<value>          Filter by id list (comma-separated)
  --name-contains=<value>  Filter by name substring
  --page=<value>           Page number to fetch
  --page-size=<value>      Number of results per page
  --sort=<value>           Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

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
  $ ppls correspondents show ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

ARGUMENTS
  ID  Correspondent id

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show correspondent details

EXAMPLES
  $ ppls correspondents show 123
```

_See code: [src/commands/correspondents/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/correspondents/show.ts)_

## `ppls custom-fields add NAME`

Create a custom field

```
USAGE
  $ ppls custom-fields add NAME --data-type boolean|date|integer|number|monetary|text|url|document link|select|long
    text [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json | --table] [--sort
    <value>] [--token <value>] [--option <value>...]

ARGUMENTS
  NAME  Custom field name

FLAGS
  --data-type=<option>  (required) Custom field data type
                        <options: boolean|date|integer|number|monetary|text|url|document link|select|long text>
  --option=<value>...   Select option label (repeatable)
  --sort=<value>        Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Create a custom field

EXAMPLES
  $ ppls custom-fields add "Due Date" --data-type date
```

_See code: [src/commands/custom-fields/add.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/custom-fields/add.ts)_

## `ppls custom-fields list`

List custom fields

```
USAGE
  $ ppls custom-fields list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> |
    --name-contains <value>]

FLAGS
  --id-in=<value>          Filter by id list (comma-separated)
  --name-contains=<value>  Filter by name substring
  --page=<value>           Page number to fetch
  --page-size=<value>      Number of results per page
  --sort=<value>           Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  List custom fields

EXAMPLES
  $ ppls custom-fields list
```

_See code: [src/commands/custom-fields/list.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/custom-fields/list.ts)_

## `ppls custom-fields show ID`

Show custom field details

```
USAGE
  $ ppls custom-fields show ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

ARGUMENTS
  ID  Custom field id

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show custom field details

EXAMPLES
  $ ppls custom-fields show 123
```

_See code: [src/commands/custom-fields/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/custom-fields/show.ts)_

## `ppls document-types add NAME`

Create a document type

```
USAGE
  $ ppls document-types add NAME [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

ARGUMENTS
  NAME  Document type name

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Create a document type

EXAMPLES
  $ ppls document-types add "Invoice"
```

_See code: [src/commands/document-types/add.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/document-types/add.ts)_

## `ppls document-types list`

List document types

```
USAGE
  $ ppls document-types list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> |
    --name-contains <value>]

FLAGS
  --id-in=<value>          Filter by id list (comma-separated)
  --name-contains=<value>  Filter by name substring
  --page=<value>           Page number to fetch
  --page-size=<value>      Number of results per page
  --sort=<value>           Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  List document types

EXAMPLES
  $ ppls document-types list
```

_See code: [src/commands/document-types/list.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/document-types/list.ts)_

## `ppls document-types show ID`

Show document type details

```
USAGE
  $ ppls document-types show ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

ARGUMENTS
  ID  Document type id

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show document type details

EXAMPLES
  $ ppls document-types show 123
```

_See code: [src/commands/document-types/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/document-types/show.ts)_

## `ppls documents list`

List documents

```
USAGE
  $ ppls documents list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> |
    --name-contains <value>]

FLAGS
  --id-in=<value>          Filter by id list (comma-separated)
  --name-contains=<value>  Filter by name substring
  --page=<value>           Page number to fetch
  --page-size=<value>      Number of results per page
  --sort=<value>           Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  List documents

EXAMPLES
  $ ppls documents list
```

_See code: [src/commands/documents/list.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/documents/list.ts)_

## `ppls documents show ID`

Show document details

```
USAGE
  $ ppls documents show ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

ARGUMENTS
  ID  Document id

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show document details

EXAMPLES
  $ ppls documents show 123
```

_See code: [src/commands/documents/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/documents/show.ts)_

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

## `ppls profile`

Show profile details

```
USAGE
  $ ppls profile [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show profile details

ALIASES
  $ ppls whoami

EXAMPLES
  $ ppls profile
```

_See code: [src/commands/profile.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/profile.ts)_

## `ppls tags add NAME`

Create a tag

```
USAGE
  $ ppls tags add NAME [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>] [--color <value>] [--inbox] [--parent <value>]

ARGUMENTS
  NAME  Tag name

FLAGS
  --color=<value>   Tag color (hex value)
  --inbox           Mark tag as an inbox tag
  --parent=<value>  Parent tag id
  --sort=<value>    Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Create a tag

EXAMPLES
  $ ppls tags add Inbox
```

_See code: [src/commands/tags/add.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/tags/add.ts)_

## `ppls tags list`

List tags

```
USAGE
  $ ppls tags list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> |
    --name-contains <value>]

FLAGS
  --id-in=<value>          Filter by id list (comma-separated)
  --name-contains=<value>  Filter by name substring
  --page=<value>           Page number to fetch
  --page-size=<value>      Number of results per page
  --sort=<value>           Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

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
  $ ppls tags show ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

ARGUMENTS
  ID  Tag id

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show tag details

EXAMPLES
  $ ppls tags show 123
```

_See code: [src/commands/tags/show.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/tags/show.ts)_

## `ppls whoami`

Show profile details

```
USAGE
  $ ppls whoami [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--sort <value>] [--token <value>]

FLAGS
  --sort=<value>  Sort results by the provided field

GLOBAL FLAGS
  --date-format=<value>  [default: yyyy-MM-dd, env: PPLS_DATE_FORMAT] Format output dates using a template.
  --json                 Format output as json.
  --plain                Format output as plain text.
  --table                Format output as table.

ENVIRONMENT FLAGS
  --header=<value>...  [env: PPLS_HEADERS] Add a custom request header (repeatable, format: Key=Value)
  --hostname=<value>   [env: PPLS_HOSTNAME] Paperless-ngx base URL
  --token=<value>      [env: PPLS_TOKEN] Paperless-ngx API token

DESCRIPTION
  Show profile details

ALIASES
  $ ppls whoami

EXAMPLES
  $ ppls whoami
```
<!-- commandsstop -->
