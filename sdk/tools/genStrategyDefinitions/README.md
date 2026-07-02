## Summer.fi Tools

# encode:makerGive

Generates the calldata necessary to give a Maker position (CDP) to another address. This is done by
executing the calldata on a DsProxy or DPM and using the CdpManager proxy actions to delegate the
call. The parameters of the tool are:

```
Options:
  -p, --makerProxyActions  Maker Proxy Actions address
  -c, --cdpManager         Maker CDP Manager address
  -i, --cdpId              ID of the position to give
  -t, --to                 Address to give the CDP to
  -h, --help               Show help
```

# strategy:gen

Generates the strategy definitions for the Summer.fi protocol. The parameters of the tool are:

## Cross-package connections

Package name: `@summerfi/get-strategy-definitions`. This is a standalone CLI codegen tool
(`src/index.ts` → `main()`), not a library — it is bundled with esbuild (`pnpm bundle`) and run via
`pnpm strategy:gen`.

**Consumes:** `@summerfi/simulator-service` (imports `refinanceLendingToLendingAnyPairStrategy` from
the `@summerfi/simulator-service/strategies` subpath — the strategy step list that gets expanded),
`@summerfi/order-planner-service` (`ActionBuildersConfig` — maps each `SimulationSteps` step to its
list of action builders in `processStep`), `@summerfi/protocol-plugins` (`ProtocolPluginsRecord` —
enumerated in `processDelegateToProtocol` to fan a `DelegatedToProtocol` step out across every
registered plugin), `@summerfi/protocol-plugins-common` (`ActionBuilderUsedAction` type),
`@summerfi/sdk-common` (`SimulationStrategy`, `StrategyStep`, `AddressValue`, `HexData`). Non-@summerfi
runtime deps: `viem` (`encodeFunctionData`/`parseAbi` for the `addOperation` calldata),
`@morpho-labs/gnosis-tx-builder` (`TxBuilder.batch` for the Safe batch file), `yargs`.

**Consumed by:** nothing in the monorepo — leaf tool. No package declares or imports
`@summerfi/get-strategy-definitions`. Its real consumer is **off-repo and on-chain**: the JSON it
writes to the `--output` path is a Safe multisend batch (or Tenderly / debug payload) of
`addOperation((bytes32[],bool[],string))` calls submitted to the legacy `OperationsRegistry`
contract (`@summerfi/core-contracts`) via a Safe multisig.

**Gotchas:**

- The whole point of this tool is the `bytes32` action hashes it emits — `action.getActionHash()` /
  `getVersionedName()` in `processAction`. Those hashes must match the versioned action hashes the
  SDK produces at execution time (order-planner-service / OperationExecutor). So any change to a
  protocol-plugin action name/version (`sdk/protocol-plugins/**`), to `ActionBuildersConfig` in
  order-planner-service, or to `refinanceLendingToLendingAnyPairStrategy` in simulator-service
  silently changes this tool's output. When those change you must re-run `strategy:gen` and push the
  new `addOperation` batch on-chain, or refinance operations will revert against a stale registry.
- Operation names are derived by string-matching action names, not from config: `generateOperationDefinitions`
  finds the step whose `name` includes `"Payback"` and the one that includes `"Deposit"`, splits on
  those substrings to get `fromProtocol`/`toProtocol`, and builds `Refinance<From><To>`. Renaming
  those actions (or a protocol whose plugin action name no longer contains `Payback`/`Deposit`)
  throws `Cannot find payback or deposit action` or produces wrong operation names.
- `processDelegateToProtocol` iterates `Object.values(ProtocolPluginsRecord)` and instantiates every
  plugin with `new pluginClass()`, so the generated operation set is exactly the plugins registered
  in `sdk/protocol-plugins/src/plugins/ProtocolPluginsRecord.ts`. Add a plugin there and this tool
  starts emitting refinance operations for it (subject to `filterIncompatibleStrategies`, which
  hardcodes the aave-v3/spark eMode rule).
- `DISABLE_OPTIONALS = true` is hardcoded in `Helpers.ts`: every action is emitted as `optional:true`
  and the optional-branch expansion is disabled. Flip it only if the on-chain registry semantics for
  optional flags change.
- Reads no `process.env`; all inputs are CLI flags (`--safe`, `--registry`, `--output`, `--format`).
  It is not wired into any stack, turbo pipeline, or `cicheck` — it is run by hand when the registry
  needs updating.

