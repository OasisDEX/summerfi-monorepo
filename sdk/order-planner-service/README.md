# @summerfi/order-planner-service

`@summerfi/order-planner-service` implements `IOrderPlannerService` (defined in
`order-planner-common`), turning simulation results into executable on-chain orders. It maintains a
registry of `IOrderPlanner` instances keyed by `SimulationType`; the only registered planner is
`DMAOrderPlanner`, which handles DMA simulations. Each planner receives a static
`ActionBuildersConfig` map that wires `SimulationSteps` values to concrete action builder classes
from `@summerfi/protocol-plugins`. This service backs `sdk-server`'s `orders.buildOrder` route via
the SDK's common/service layering pattern. SDK reference docs live in `gitbook/reference`.

## Key exports

| Export                 | Description                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `OrderPlannerService`  | Concrete service class; instantiate directly with `new OrderPlannerService()` — no factory |
| `ActionBuildersConfig` | Static `ActionBuildersMap` mapping every `SimulationStep` to its action builder class      |

## Commands

```bash
pnpm build          # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm tsc            # type-check only
pnpm watch          # tsc -w
```

No test script is declared in `package.json`; tests in `tests/` are run via the workspace-level
turbo pipeline.

## Cross-package connections

**Consumes:** `order-planner-common` (interfaces), `sdk-common`, `protocol-plugins` (action
builders), `protocol-plugins-common`, `armada-protocol-common`, `address-book-common`,
`contracts-provider-common`, `deployment-utils`, `oracle-common`, `swap-common`, `tokens-common`.

**Consumed by:** `sdk-server` — instantiated once in `SDKContext.ts` as `new OrderPlannerService()`
(no injection factory; direct instantiation) — and `sdk/tools/genStrategyDefinitions`, which imports
`OrderPlannerService`.

**Gotchas:**

- `ActionBuildersConfig` is a hand-maintained static map in `src/config/Config.ts`; adding a new
  `SimulationStep` requires a matching entry here or `buildOrder` will throw at runtime.
- `OrderPlannerService` self-registers planners in its constructor; adding a new planner requires
  calling `_registerOrderPlanner` there — the map is not extensible from outside.
