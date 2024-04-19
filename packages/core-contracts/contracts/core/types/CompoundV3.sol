// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

struct DepositData {
  address cometAddress;
  address asset;
  uint256 amount;
}

struct BorrowData {
  address cometAddress;
  address asset;
  uint256 amount;
}

struct WithdrawData {
  address cometAddress;
  address asset;
  uint256 amount;
  bool withdrawAll;
}

struct PaybackData {
  address cometAddress;
  address asset;
  uint256 amount;
  bool paybackAll;
}
