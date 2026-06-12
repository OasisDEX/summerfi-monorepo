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
