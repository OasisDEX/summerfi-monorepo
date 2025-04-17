import { encodeFunctionData, parseAbi } from 'viem';
export function encodeMakerProxyActionsAllow(params) {
    const abi = parseAbi([
        'function cdpAllow(address cdpManager, uint256 cdpId, address to, uint allow)',
    ]);
    return encodeFunctionData({
        abi,
        functionName: 'cdpAllow',
        args: [params.cdpManagerAddress, BigInt(params.cdpId), params.allowAddress, 1n],
    });
}
export function encodeDsProxyExecute(params) {
    const abi = parseAbi(['function execute(address target, bytes calldata data)']);
    return encodeFunctionData({
        abi,
        functionName: 'execute',
        args: [params.target, params.callData],
    });
}
export function encodeMakerAllowThroughProxyActions(params) {
    const makerAllowCalldata = encodeMakerProxyActionsAllow(params);
    const transactionCalldata = encodeDsProxyExecute({
        target: params.makerProxyActionsAddress,
        callData: makerAllowCalldata,
    });
    return {
        transactionCalldata,
        dsProxyParameters: {
            target: params.makerProxyActionsAddress,
            callData: makerAllowCalldata,
        },
    };
}
//# sourceMappingURL=MakerGive.js.map