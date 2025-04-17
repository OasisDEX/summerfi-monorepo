import { AddressValue } from '@summerfi/sdk-common';
import { Hex } from 'viem';
export declare function encodeMakerProxyActionsAllow(params: {
    cdpManagerAddress: AddressValue;
    cdpId: string;
    allowAddress: AddressValue;
}): Hex;
export declare function encodeDsProxyExecute(params: {
    target: Hex;
    callData: Hex;
}): Hex;
export declare function encodeMakerAllowThroughProxyActions(params: {
    makerProxyActionsAddress: AddressValue;
    cdpManagerAddress: AddressValue;
    cdpId: string;
    allowAddress: AddressValue;
}): {
    transactionCalldata: Hex;
    dsProxyParameters: {
        target: Hex;
        callData: Hex;
    };
};
//# sourceMappingURL=MakerGive.d.ts.map