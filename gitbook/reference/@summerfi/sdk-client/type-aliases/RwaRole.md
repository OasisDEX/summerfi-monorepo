# Type Alias: RwaRole

```ts
type RwaRole = 
  | {
  kind: "GOVERNOR";
}
  | {
  kind: "SUPER_KEEPER";
}
  | {
  kind: "GUARDIAN";
}
  | {
  kind: "DECAY_CONTROLLER";
}
  | {
  kind: "ADMIRALS_QUARTERS";
}
  | {
  kind: "FOUNDATION";
}
  | {
  kind: "WHITELIST_MANAGER";
}
  | {
  kind: "KEEPER";
  target: AddressValue;
}
  | {
  kind: "CURATOR";
  target: AddressValue;
}
  | {
  kind: "COMMANDER";
  target: AddressValue;
}
  | {
  kind: "OPERATOR";
  target: AddressValue;
};
```

Defined in: [../sdk-common/src/common/types/RwaRole.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/RwaRole.ts#L12)

A grantable / revocable role on an institution's ProtocolAccessManager(V2). Global roles
carry no target; contract-specific roles (Keeper/Curator/Operator on a Fleet, Commander
on an Ark) target a specific contract. Mirrors the on-chain typed role wrappers
(`grantGovernorRole`, `grantKeeperRole`, …) — the contract derives the role hash, so no
hash is passed. `ProtocolAccessManager` disables OZ's generic `grantRole`, which is why
these map to the typed wrappers rather than a single (role-hash, account) call.
