---
name: paperless-ngx-api
description: Use when working with the Paperless-ngx REST API; looking up endpoints, request/response shapes, auth requirements, filtering/pagination, or generating example requests/responses from the OpenAPI spec. Trigger for tasks involving Paperless-ngx API integrations, client code, curl examples, or schema details.
---

# Paperless Ngx Api

## Overview

Use the bundled OpenAPI spec to answer endpoint questions, build requests, and validate payloads for the Paperless-ngx REST API.

## Required dependency

- `yq` (required) for YAML parsing and targeted extraction from the OpenAPI spec.

## Core workflow

1. Open the OpenAPI spec in `references/paperless-ngx-rest-api.yaml` and extract only the needed sections.
2. Use `yq` to find the relevant paths, operations, parameters, schemas, and response shapes.
3. Produce the requested output (endpoint lookup, example request/response, client code shape, or validation notes).

## Reference usage

The OpenAPI spec is stored at `references/paperless-ngx-rest-api.yaml`. Prefer `yq` for targeted extraction instead of loading the entire file.

Common `yq` snippets (adjust selectors based on the spec structure):

- List paths:
  - `yq '.paths | keys' references/paperless-ngx-rest-api.yaml`
- Inspect an operation:
  - `yq '.paths["/api/documents/"].get' references/paperless-ngx-rest-api.yaml`
- Find a schema:
  - `yq '.components.schemas | keys' references/paperless-ngx-rest-api.yaml`
- View a schema definition:
  - `yq '.components.schemas.Document' references/paperless-ngx-rest-api.yaml`

## Output expectations

- Be explicit about HTTP method, path, required headers, and auth scheme from the spec.
- Call out pagination, filtering, and ordering parameters when present.
- For upload endpoints, specify content type and multipart field names from the spec.
- When unsure, verify in the spec before answering.

## Resources

### references/

- `paperless-ngx-rest-api.yaml` (OpenAPI spec)
