import type { MockContract } from "@defi-wonderland/smock";
import { network } from "hardhat";

import type { BaseContract } from "ethers";

export declare type MockOrContract<T extends BaseContract> =
  | T
  | MockContract<T>;

export function isMock<T extends BaseContract>(
  contract: MockOrContract<T>
): contract is MockContract<T> {
  return (
    (contract as MockContract<T>).wallet !== undefined &&
    (contract as MockContract<T>).fallback !== undefined
  );
}

export function asMock<T extends BaseContract>(
  contract: MockOrContract<T>
): MockContract<T> {
  if (isMock(contract)) {
    return contract as MockContract<T>;
  } else {
    throw new Error(`Contract with address ${contract.address} is not a mock`);
  }
}

export function ifMocksEnabled(fn: () => void): void {
  if (network.name === "hardhat") {
    fn();
  }
}
