# @summerfi/turbo-generators

Plop-based code generators invoked via `turbo gen` (the `@turbo/gen` harness).

Registers two generators in `config.ts`:

- **plugin** — scaffolds a full protocol-plugin package under
  `sdk/protocol-plugins/src/plugins/<name>/` (ABIs, implementation classes, interfaces, types,
  action builders, and integration/unit test stubs).
- **service** — scaffolds a new SDK service package with base directories and common boilerplate.

Templates live alongside each generator: `turbo/generators/protocol-plugins/templates/` for the
**plugin** generator and `turbo/generators/sdk-service/templates/` for the **service** generator.
Both use Handlebars (`.hbs`) files. A small number of shared templates also exist in
`turbo/generators/templates/common/`.

**Gotcha:** this package has no `build` script and is `private`; it is loaded at generation time
only and never published or imported by application code.

## Cross-package connections

**Consumes:** nothing at runtime — `config.ts` imports only `@turbo/gen` and the two local
generator modules (`./protocol-plugins`, `./sdk-service`). The only `@summerfi/*` deps in
`package.json` (`@summerfi/eslint-config`, `@summerfi/typescript-config`) are build/lint tooling.
The generator source never imports `@summerfi/*`; it only emits files that do.

**Consumed by:** nothing in the monorepo imports this package — it is invoked as a CLI (`turbo gen`
→ `@turbo/gen` discovers `turbo/generators/config.ts`). Referenced by the `AGENTS.md` "Add a new SDK
service" and "Add a new protocol plugin" checklists and by `sdk/docs/ADD_SDK_SERVICE.md` /
`sdk/docs/ADD_NEW_PLUGIN.md`.

**Gotchas:**

- The generators write **into other packages' directories**, not their own. The **service**
  generator (`sdk-service/actionsCommon.ts` + `actionsService.ts`) scaffolds two sibling packages at
  `sdk/<name>-common/` and `sdk/<name>-service/`; the **plugin** generator
  (`protocol-plugins/actions.ts`, output rooted by `protocol-plugins/helpers/createProtocolPluginDirectory.ts`)
  writes under `sdk/protocol-plugins/src/plugins/<name>/`. The output paths are hard-coded
  string literals (`sdk/{{nameKebabCase}}-...`) — moving/renaming those target dirs silently breaks
  scaffolding with no compile-time signal.
- The scaffolded `package.json` templates (`sdk-service/templates/{common,service}/package.hbs`)
  hard-pin `workspace:*` deps that must already exist in the repo: `-common` pins
  `@summerfi/sdk-common`; `-service` pins `@summerfi/{{nameKebabCase}}-common`, `@summerfi/common`,
  `@summerfi/configuration-provider`, `@summerfi/sdk-common` plus the `eslint-config` /
  `jest-config` / `testing-utils` / `typescript-config` tooling. Renaming any of those packages
  requires editing these `.hbs` files, not just the real package.
- Scaffolding is **step 1 only** — the generated code is inert until manually wired per the
  `AGENTS.md` checklists: a new service must be added to `sdk-server`'s `SDKContext.ts` /
  `SDKAppRouter.ts` and `sdk-client`'s `SDKManager`; a new plugin's `ProtocolNameEnum.hbs` output is
  a reminder to add the entry to the real `ProtocolName` enum in `sdk-common` and register the class
  in `protocol-plugins`' `ProtocolPluginsRecord.ts`.
- `@turbo/gen` locates this file by convention at `turbo/generators/config.ts` (no `turbo.json`
  wiring); the `default export` function name and the two `setup*Generator(plop)` calls are the
  registration surface.
