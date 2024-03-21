import {ChainInfo} from "@summerfi/sdk-common/common";
import {SimulationSteps, steps} from "@summerfi/sdk-common/simulation";
import {ProtocolName, MakerPoolId} from "@summerfi/sdk-common/protocols";
import assert from "assert";
import {
    BaseProtocolPlugin,
    IProtocolPluginContext,
    MakerPaybackWithdrawActionBuilder,
    MakerProtocolPlugin
} from "../../src";
import {IPositionId} from "../../src/interfaces/IPositionId";
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
        const makerPoolIdValid = makerPoolIdMock;
        await expect(makerProtocolPlugin.getPool(makerPoolIdValid)).resolves.toBeDefined();
    });

    it('should throw an error when calling getPool with an unsupported MakerPoolId', async () => {
        const invalidMakerPoolIdUnsupportedChain = {
            ...makerPoolIdMock,
            protocol: {
                ...makerPoolIdMock.protocol,
                chainInfo: ChainInfo.createFrom({
                    chainId: 2,
                    name: 'Unknown'
                })
            }
        };
        await expect(makerProtocolPlugin.getPool(invalidMakerPoolIdUnsupportedChain)).rejects.toThrow('Candidate is not correct')
    });

    it('should throw an error when calling getPool with chain id missing from ctx', async () => {
        const makerProtocolPluginWithWrongContext = new MakerProtocolPlugin()
        makerProtocolPluginWithWrongContext.init({
            ...ctx,
            provider: {
                ...ctx.provider,
                chain: {
                    ...ctx.provider.chain!,
                    id: undefined as unknown as number
                }
            }
        })
        await expect(makerProtocolPluginWithWrongContext.getPool(makerPoolIdMock)).rejects.toThrow(`ctx.provider.chain.id undefined`);
    });

    it('should throw an error when calling getPool with an unsupported chain ID', async () => {
        const makerProtocolPluginWithWrongContext = new MakerProtocolPlugin()
        const wrongChainId = 2;
        makerProtocolPluginWithWrongContext.init({
            ...ctx,
            provider: {
                ...ctx.provider,
                chain: {
                    ...ctx.provider.chain!,
                    id: wrongChainId
                }
            }
        })
        await expect(makerProtocolPluginWithWrongContext.getPool(makerPoolIdMock)).rejects.toThrow(`Chain ID ${wrongChainId} is not supported`);
    });

    it('should throw a "Not implemented" error when calling getPosition', async () => {
        const positionId = "mockPositionId" as IPositionId;
        await expect(makerProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented');
    });
})