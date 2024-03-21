import {ProtocolName, MakerPoolId} from "@summerfi/sdk-common/protocols";
import assert from "assert";
import {BaseProtocolPlugin, IProtocolPluginContext, MakerProtocolPlugin} from "../../src";
import {makerPoolIdMock} from "../mocks/MakerPoolIdMock"
import {createProtocolPluginContext} from "../utils/CreateProtocolPluginContext";
import {getErrorMessage} from "../utils/ErrorMessage";

describe('Maker Protocol Plugin', () => {
    let ctx: IProtocolPluginContext
    let makerProtocolPlugin: BaseProtocolPlugin<MakerPoolId>
    beforeAll(async () => {
        ctx = await createProtocolPluginContext()
        makerProtocolPlugin = new MakerProtocolPlugin()
        makerProtocolPlugin.init(ctx)
    })

    it('should verify that a given poolId is recognised as a valid format', () => {
        try {
            makerProtocolPlugin.isPoolId(makerPoolIdMock)
        } catch (error: unknown) {
            assert.fail('Should not throw')
        }
    })

    it('should throw a specific error when provided with a poolId not matching the MakerPoolId format', () => {
        try {
            const invalidMakerPoolId = {
                ...makerPoolIdMock,
                protocol: {
                    ...makerPoolIdMock.protocol,
                    name: ProtocolName.AAVEv3
                }
            }
            makerProtocolPlugin.isPoolId(invalidMakerPoolId)
            assert.fail('Should throw error')
        } catch (error: unknown) {
            expect(getErrorMessage(error)).toMatch('Candidate is not correct')
        }
    })

    it('should correctly initialize and set the context', () => {
        expect(makerProtocolPlugin.ctx).toBe(ctx);
    });

    it('should correctly return a MakerLendingPool object for a valid MakerPoolId', async () => {
        const makerPoolIdValid = {/* Valid MakerPoolId mock object */};
        await expect(makerProtocolPlugin.getPool(makerPoolIdValid)).resolves.toBeDefined();
    });

    it('should throw an error when calling getPool with an unsupported chain ID', async () => {
        const makerPoolIdUnsupportedChain = {/* MakerPoolId with unsupported chain ID */};
        await expect(makerProtocolPlugin.getPool(makerPoolIdUnsupportedChain)).rejects.toThrow('Chain ID is not supported');
    });

    it('should throw a "Not implemented" error when calling getPosition', async () => {
        const positionId = {/* Mock position ID */};
        await expect(makerProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented');
    });

    // it('should return the correct action builder for a supported simulation step', () => {
    //     const step = { type: SimulationSteps.PaybackWithdraw };
    //     const actionBuilder = makerProtocolPlugin.getActionBuilder(step);
    //     expect(actionBuilder).toBeInstanceOf(MakerPaybackWithdrawActionBuilder);
    // });
    //
    // it('should return undefined for an unsupported simulation step', () => {
    //     const step = { type: 'UnsupportedStep' };
    //     const actionBuilder = makerProtocolPlugin.getActionBuilder(step);
    //     expect(actionBuilder).toBeUndefined();
    // });

})