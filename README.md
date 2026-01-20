# ppls

A node-based paperless-ngx cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ppls.svg)](https://npmjs.org/package/ppls)
[![Downloads/week](https://img.shields.io/npm/dw/ppls.svg)](https://npmjs.org/package/ppls)

<!-- toc -->
* [ppls](#ppls)
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
ppls/0.0.0 darwin-arm64 node-v24.13.0
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
* [`ppls config get KEY`](#ppls-config-get-key)
* [`ppls config init`](#ppls-config-init)
* [`ppls config list`](#ppls-config-list)
* [`ppls config remove KEY`](#ppls-config-remove-key)
* [`ppls config set KEY VALUE`](#ppls-config-set-key-value)
* [`ppls correspondents add NAME`](#ppls-correspondents-add-name)
* [`ppls correspondents delete ID`](#ppls-correspondents-delete-id)
* [`ppls correspondents list`](#ppls-correspondents-list)
* [`ppls correspondents show ID`](#ppls-correspondents-show-id)
* [`ppls correspondents update ID`](#ppls-correspondents-update-id)
* [`ppls custom-fields add NAME`](#ppls-custom-fields-add-name)
* [`ppls custom-fields delete ID`](#ppls-custom-fields-delete-id)
* [`ppls custom-fields list`](#ppls-custom-fields-list)
* [`ppls custom-fields show ID`](#ppls-custom-fields-show-id)
* [`ppls custom-fields update ID`](#ppls-custom-fields-update-id)
* [`ppls document-types add NAME`](#ppls-document-types-add-name)
* [`ppls document-types delete ID`](#ppls-document-types-delete-id)
* [`ppls document-types list`](#ppls-document-types-list)
* [`ppls document-types show ID`](#ppls-document-types-show-id)
* [`ppls document-types update ID`](#ppls-document-types-update-id)
* [`ppls documents add [PATH]`](#ppls-documents-add-path)
* [`ppls documents delete ID`](#ppls-documents-delete-id)
* [`ppls documents download ID`](#ppls-documents-download-id)
* [`ppls documents list`](#ppls-documents-list)
* [`ppls documents show ID`](#ppls-documents-show-id)
* [`ppls documents update ID`](#ppls-documents-update-id)
* [`ppls help [COMMAND]`](#ppls-help-command)
* [`ppls profile`](#ppls-profile)
* [`ppls tags add NAME`](#ppls-tags-add-name)
* [`ppls tags delete ID`](#ppls-tags-delete-id)
* [`ppls tags list`](#ppls-tags-list)
* [`ppls tags show ID`](#ppls-tags-show-id)
* [`ppls tags update ID`](#ppls-tags-update-id)
* [`ppls whoami`](#ppls-whoami)

## `ppls config get KEY`

Get a config value

```
USAGE
  $ ppls config get KEY [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>]

ARGUMENTS
  KEY  Config key

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
  Get a config value

EXAMPLES
  $ ppls config get hostname
```

_See code: [src/commands/config/get.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/config/get.ts)_

## `ppls config init`

Initialize a config file

```
USAGE
  $ ppls config init [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [-f]

FLAGS
  -f, --force  Overwrite existing config file

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
  Initialize a config file

EXAMPLES
  $ ppls config init
```

_See code: [src/commands/config/init.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/config/init.ts)_

## `ppls config list`

List config values

```
USAGE
  $ ppls config list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>]

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
  List config values

EXAMPLES
  $ ppls config list
```

_See code: [src/commands/config/list.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/config/list.ts)_

## `ppls config remove KEY`

Remove a config value

```
USAGE
  $ ppls config remove KEY [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>]

ARGUMENTS
  KEY  Config key

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
  Remove a config value

EXAMPLES
  $ ppls config remove token
```

_See code: [src/commands/config/remove.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/config/remove.ts)_

## `ppls config set KEY VALUE`

Set a config value

```
USAGE
  $ ppls config set KEY VALUE [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain |
    --json | --table] [--token <value>]

ARGUMENTS
  KEY    Config key
  VALUE  Config value

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
  Set a config value

EXAMPLES
  $ ppls config set hostname https://paperless.example.com

  $ ppls config set headers '{"X-Api-Key":"token"}'
```

_See code: [src/commands/config/set.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/config/set.ts)_

## `ppls correspondents add NAME`

Create a correspondent

```
USAGE
  $ ppls correspondents add NAME [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>]

ARGUMENTS
  NAME  Correspondent name

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
  Create a correspondent

EXAMPLES
  $ ppls correspondents add "Acme Corp"
```

_See code: [src/commands/correspondents/add.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/correspondents/add.ts)_

## `ppls correspondents delete ID`

Delete a correspondent

```
USAGE
  $ ppls correspondents delete ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [-y]

ARGUMENTS
  ID  Correspondent id

FLAGS
  -y, --yes  Skip confirmation prompt

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
  Delete a correspondent

EXAMPLES
  $ ppls correspondents delete 123
```

_See code: [src/commands/correspondents/delete.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/correspondents/delete.ts)_

## `ppls correspondents list`

List correspondents

```
USAGE
  $ ppls correspondents list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> | --name-contains <value>]
    [--sort <value>]

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
    --table] [--token <value>]

ARGUMENTS
  ID  Correspondent id

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

## `ppls correspondents update ID`

Update a correspondent

```
USAGE
  $ ppls correspondents update ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--name <value>]

ARGUMENTS
  ID  Correspondent id

FLAGS
  --name=<value>  Correspondent name

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
  Update a correspondent

EXAMPLES
  $ ppls correspondents update 123 --name "Acme Corp"
```

_See code: [src/commands/correspondents/update.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/correspondents/update.ts)_

## `ppls custom-fields add NAME`

Create a custom field

```
USAGE
  $ ppls custom-fields add NAME --data-type boolean|date|integer|number|monetary|text|url|document link|select|long
    text [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json | --table] [--token
    <value>] [--option <value>...]

ARGUMENTS
  NAME  Custom field name

FLAGS
  --data-type=<option>  (required) Custom field data type
                        <options: boolean|date|integer|number|monetary|text|url|document link|select|long text>
  --option=<value>...   Select option label (repeatable)

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

## `ppls custom-fields delete ID`

Delete a custom field

```
USAGE
  $ ppls custom-fields delete ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [-y]

ARGUMENTS
  ID  Custom field id

FLAGS
  -y, --yes  Skip confirmation prompt

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
  Delete a custom field

EXAMPLES
  $ ppls custom-fields delete 123
```

_See code: [src/commands/custom-fields/delete.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/custom-fields/delete.ts)_

## `ppls custom-fields list`

List custom fields

```
USAGE
  $ ppls custom-fields list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> | --name-contains <value>]
    [--sort <value>]

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
    --table] [--token <value>]

ARGUMENTS
  ID  Custom field id

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

## `ppls custom-fields update ID`

Update a custom field

```
USAGE
  $ ppls custom-fields update ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--data-type boolean|date|integer|number|monetary|text|url|document link|select|long
    text] [--name <value>] [--option <value>...]

ARGUMENTS
  ID  Custom field id

FLAGS
  --data-type=<option>  Custom field data type
                        <options: boolean|date|integer|number|monetary|text|url|document link|select|long text>
  --name=<value>        Custom field name
  --option=<value>...   Select option label (repeatable)

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
  Update a custom field

EXAMPLES
  $ ppls custom-fields update 123 --name "Due Date"
```

_See code: [src/commands/custom-fields/update.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/custom-fields/update.ts)_

## `ppls document-types add NAME`

Create a document type

```
USAGE
  $ ppls document-types add NAME [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>]

ARGUMENTS
  NAME  Document type name

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

## `ppls document-types delete ID`

Delete a document type

```
USAGE
  $ ppls document-types delete ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [-y]

ARGUMENTS
  ID  Document type id

FLAGS
  -y, --yes  Skip confirmation prompt

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
  Delete a document type

EXAMPLES
  $ ppls document-types delete 123
```

_See code: [src/commands/document-types/delete.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/document-types/delete.ts)_

## `ppls document-types list`

List document types

```
USAGE
  $ ppls document-types list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> | --name-contains <value>]
    [--sort <value>]

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
    --table] [--token <value>]

ARGUMENTS
  ID  Document type id

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

## `ppls document-types update ID`

Update a document type

```
USAGE
  $ ppls document-types update ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--name <value>]

ARGUMENTS
  ID  Document type id

FLAGS
  --name=<value>  Document type name

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
  Update a document type

EXAMPLES
  $ ppls document-types update 123 --name "Invoice"
```

_See code: [src/commands/document-types/update.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/document-types/update.ts)_

## `ppls documents add [PATH]`

Upload one or more documents. Supports multiple arguments or a glob.

```
USAGE
  $ ppls documents add [PATH...] [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain |
    --json | --table] [--token <value>] [--archive-serial-number <value>] [--correspondent <value>] [--created <value>]
    [--document-type <value>] [--storage-path <value>] [--tag <value>...] [--title <value>]

ARGUMENTS
  [PATH...]  Document file path(s)

FLAGS
  --archive-serial-number=<value>  Archive serial number
  --correspondent=<value>          Correspondent id
  --created=<value>                Document created date-time
  --document-type=<value>          Document type id
  --storage-path=<value>           Storage path id
  --tag=<value>...                 Tag id (repeatable)
  --title=<value>                  Document title

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
  Upload one or more documents. Supports multiple arguments or a glob.

EXAMPLES
  $ ppls documents add ./receipt.pdf --title "Receipt"
```

_See code: [src/commands/documents/add.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/documents/add.ts)_

## `ppls documents delete ID`

Delete a document

```
USAGE
  $ ppls documents delete ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [-y]

ARGUMENTS
  ID  Document id

FLAGS
  -y, --yes  Skip confirmation prompt

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
  Delete a document

EXAMPLES
  $ ppls documents delete 123
```

_See code: [src/commands/documents/delete.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/documents/delete.ts)_

## `ppls documents download ID`

Download one or more documents

```
USAGE
  $ ppls documents download ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--original] [-o <value> | --output-dir <value>]

ARGUMENTS
  ID  Document id or comma-separated list of ids

FLAGS
  -o, --output=<value>      Output file path (single document)
      --original            Download original file
      --output-dir=<value>  Output directory (multiple documents)

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
  Download one or more documents

EXAMPLES
  $ ppls documents download 123 --output document.pdf

  $ ppls documents download 123,124 --output-dir ./downloads
```

_See code: [src/commands/documents/download.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/documents/download.ts)_

## `ppls documents list`

List documents

```
USAGE
  $ ppls documents list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> | --name-contains <value>]
    [--sort <value>]

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
    --table] [--token <value>]

ARGUMENTS
  ID  Document id

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

## `ppls documents update ID`

Update a document

```
USAGE
  $ ppls documents update ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--archive-serial-number <value>] [--content <value>] [--correspondent <value>]
    [--created <value>] [--document-type <value>] [--storage-path <value>] [--tag <value>...] [--title <value>]

ARGUMENTS
  ID  Document id

FLAGS
  --archive-serial-number=<value>  Archive serial number
  --content=<value>                Document content
  --correspondent=<value>          Correspondent id
  --created=<value>                Document created date
  --document-type=<value>          Document type id
  --storage-path=<value>           Storage path id
  --tag=<value>...                 Tag id (repeatable)
  --title=<value>                  Document title

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
  Update a document

EXAMPLES
  $ ppls documents update 123 --title "Receipt"
```

_See code: [src/commands/documents/update.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/documents/update.ts)_

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
    --table] [--token <value>]

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
    --table] [--token <value>] [--color <value>] [--inbox] [--parent <value>]

ARGUMENTS
  NAME  Tag name

FLAGS
  --color=<value>   Tag color (hex value)
  --inbox           Mark tag as an inbox tag
  --parent=<value>  Parent tag id

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

## `ppls tags delete ID`

Delete a tag

```
USAGE
  $ ppls tags delete ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [-y]

ARGUMENTS
  ID  Tag id

FLAGS
  -y, --yes  Skip confirmation prompt

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
  Delete a tag

EXAMPLES
  $ ppls tags delete 123
```

_See code: [src/commands/tags/delete.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/tags/delete.ts)_

## `ppls tags list`

List tags

```
USAGE
  $ ppls tags list [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--page <value>] [--page-size <value>] [--id-in <value> | --name-contains <value>]
    [--sort <value>]

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
    --table] [--token <value>]

ARGUMENTS
  ID  Tag id

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

## `ppls tags update ID`

Update a tag

```
USAGE
  $ ppls tags update ID [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>] [--color <value>] [--inbox] [--name <value>] [--parent <value>]

ARGUMENTS
  ID  Tag id

FLAGS
  --color=<value>   Tag color (hex value)
  --[no-]inbox      Mark tag as an inbox tag
  --name=<value>    Tag name
  --parent=<value>  Parent tag id

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
  Update a tag

EXAMPLES
  $ ppls tags update 123 --name Inbox
```

_See code: [src/commands/tags/update.ts](https://github.com/nickchristensen/ppls/blob/v0.0.0/src/commands/tags/update.ts)_

## `ppls whoami`

Show profile details

```
USAGE
  $ ppls whoami [--date-format <value>] [--header <value>...] [--hostname <value>] [--plain | --json |
    --table] [--token <value>]

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
