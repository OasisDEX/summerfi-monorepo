# @summerfi/app-risk

# useRisk Hook

## Overview

The `useRisk` hook is a custom React hook designed to determine the risk status of a given wallet address on a specific blockchain network. It sends a request to a specified API endpoint to fetch the risk status and manages the loading state as well as errors during the request.
This package assumes that API already exists, which in the end may vary per specific app.

## Installation

To use the `useRisk` hook in your project, you need to have React installed. You can then add the hook to your project.

## Usage

### Parameters

- `chainId` (number): The chain ID of the blockchain network.
- `walletAddress` (string, optional): The wallet address to be checked for risk status.
- `host` (string, optional): The host URL for the API server.

### Returns

The hook returns an object representing the risk state which includes:
- `isRisky` (boolean): A boolean indicating if the wallet is considered risky.
- `error` (string): An error message if the request fails.
- `isLoading` (boolean): A boolean indicating if the request is in progress.
