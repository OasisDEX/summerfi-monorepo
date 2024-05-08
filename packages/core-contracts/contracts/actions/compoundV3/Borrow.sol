// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

import {Executable} from '../../common/Executable.sol';
import {UseStore, Write, Read} from '../../common/UseStore.sol';
import {OperationStorage} from '../../../core/OperationStorage.sol';
import {BorrowData} from '../../../core/types/CompoundV3.sol';
import {CometInterface} from '../../../interfaces/compoundV3/CometInterface.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @title Borrow | Compound V3 Action contract
 * @notice Borrow collateral from Compound's lending pool
 */
contract CompoundV3Borrow is Executable, UseStore {
  using Write for OperationStorage;

  constructor(address _registry) UseStore(_registry) {}

  /**
   * @dev Look at UseStore.sol to get additional info on paramsMapping.
   * @param data Encoded calldata that conforms to the BorrowData struct
   * @param data.comet The address of the Comet contract
   * @param data.asset The address of the asset to borrow
   * @param data.amount The amount to borrow
   * @param paramsMap Maps operation storage values by index (index offset by +1) to execute calldata params
   */
  function execute(bytes calldata data, uint8[] memory) external payable override {
    BorrowData memory borrow = parseInputs(data);

    uint256 balanceBefore = IERC20(borrow.asset).balanceOf(address(this));
    CometInterface(borrow.cometAddress).withdraw(borrow.asset, borrow.amount);
    uint256 balanceAfter = IERC20(borrow.asset).balanceOf(address(this));
    uint256 borrowedAmount = balanceAfter - balanceBefore;

    store().write(bytes32(borrowedAmount));
  }

  function parseInputs(bytes memory _callData) public pure returns (BorrowData memory params) {
    return abi.decode(_callData, (BorrowData));
  }
}
