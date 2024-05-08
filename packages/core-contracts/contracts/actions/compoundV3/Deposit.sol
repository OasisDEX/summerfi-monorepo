// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

import {Executable} from '../../common/Executable.sol';
import {UseStore, Write, Read} from '../../common/UseStore.sol';
import {OperationStorage} from '../../../core/OperationStorage.sol';
import {DepositData} from '../../../core/types/CompoundV3.sol';
import {CometInterface} from '../../../interfaces/compoundV3/CometInterface.sol';

/**
 * @title Deposit | Compound V3 Action contract
 * @notice Pays back a specified amount to Compound V3's lending pool
 */
contract CompoundV3Deposit is Executable, UseStore {
  using Write for OperationStorage;
  using Read for OperationStorage;

  constructor(address _registry) UseStore(_registry) {}

  /**
   * @dev Look at UseStore.sol to get additional info on paramsMapping.
   * @param data Encoded calldata that conforms to the DepositData struct
   * @param data.comet The address of the Comet contract
   * @param data.asset The address of the asset to pay back
   * @param data.amount The amount to pay back
   * @param paramsMap Maps operation storage values by index (index offset by +1) to execute calldata params
   */
  function execute(bytes calldata data, uint8[] memory paramsMap) external payable override {
    DepositData memory deposit = parseInputs(data);

    deposit.amount = store().readUint(bytes32(Deposit.amount), paramsMap[1], address(this));
    uint256 depositAmount = Deposit.DepositAll ? type(uint256).max : deposit.amount;
    uint256 balanceBefore = IERC20(deposit.asset).balanceOf(address(this));
    CometInterface(deposit.cometAddress).supply(deposit.asset, depositAmount);
    uint256 balanceAfter = IERC20(deposit.asset).balanceOf(address(this));
    uint256 depositAmount = balanceBefore - balanceAfter;

    store().write(bytes32(depositAmount));
  }

  function parseInputs(bytes memory _callData) public pure returns (DepositData memory params) {
    return abi.decode(_callData, (DepositData));
  }
}
