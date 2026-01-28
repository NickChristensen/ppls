---
name: oclif-cli-framework
description: Create and modify oclif-based Node.js CLIs and plugins. Use when scaffolding an oclif project, adding commands/flags/args, configuring topics/plugins/hooks/help, testing with @oclif/test, or packaging/releasing via npm, tarballs, or installers.
---

# oclif CLI Framework

## Overview

Build, extend, and release oclif CLIs with the generator, command API, and configuration system. Use this skill to decide the right workflow (new CLI vs existing project vs plugin), implement commands with flags/args, and prepare testing and release steps.

## Workflow Decision Tree

- Need a new CLI? Use `oclif generate` and the template defaults.
- Adding oclif to an existing repo? Use `oclif init` and then add commands.
- Adding a command or hook? Use `oclif generate command` or `oclif generate hook`.
- Organizing command structure or help? Configure topics, help, and `topicSeparator`.
- Extending behavior or modularizing? Add plugins and hooks.
- Preparing for release? Choose npm, tarballs, or installers and set update config.

## Core Workflows

### 1) Scaffold or initialize

- Decide module type (ESM or CommonJS) and package manager.
- Run the generator or init command.
- Use the `bin/dev.*` scripts for local development and `bin/run.*` for production.
- Open `references/project-generation.md` for generator options and template details.

### 2) Add or update a command

- Add a command skeleton with `oclif generate command <topic:cmd>`.
- Define flags and args with `Flags` and `Args`, then parse with `this.parse(MyCommand)`.
- If you need variable-length args, set `static strict = false` and read `argv`.
- Open `references/command-authoring.md` for flag/arg options and command helpers.

### 3) Configure topics, plugins, and hooks

- Organize commands via folders under `src/commands`.
- Add topics, plugins, hooks, and help settings in the `oclif` config.
- Use hooks for lifecycle or custom events; call `this.config.runHook` when needed.
- Open `references/config-and-plugins.md` for configuration keys and topic rules.
- Open `references/hooks-testing-release.md` for lifecycle events and hook notes.

### 4) Test and release

- Use `@oclif/test` helpers (or your preferred framework) to run commands.
- If using Vitest, disable console interception to capture stdout/stderr.
- Release via npm or build standalone artifacts with `oclif pack` and publish/upload.
- Open `references/hooks-testing-release.md` for release options and update channels.

## References

- `references/project-generation.md` for generator commands, templates, and bin scripts.
- `references/command-authoring.md` for command structure, flags/args, and helpers.
- `references/config-and-plugins.md` for config keys, topics, and plugins.
- `references/hooks-testing-release.md` for hooks, testing, and release workflows.
- `references/docs/` for the full doc set copied from this repo (all top-level Markdown files).

Consult the source docs for deeper details: `introduction.md`, `generator_commands.md`, `templates.md`, `commands.md`, `flags.md`, `args.md`, `configuring_your_cli.md`, `topics.md`, `plugins.md`, `hooks.md`, `testing.md`, `releasing.md`.
