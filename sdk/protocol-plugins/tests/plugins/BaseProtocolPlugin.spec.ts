import {SimulationSteps, steps} from "@summerfi/sdk-common/simulation";
import {MakerPoolId} from "@summerfi/sdk-common/protocols";
import {IProtocolPluginContext, MakerProtocolPlugin, BaseProtocolPlugin} from "../../src";
import {createProtocolPluginContext} from "../utils/CreateProtocolPluginContext";
import { getErrorMessage } from "../utils/ErrorMessage";
import assert from 'assert'

describe('Base Protocol Plugin', () => {
    let ctx: IProtocolPluginContext
    let baseProtocolPlugin: BaseProtocolPlugin<MakerPoolId>
    beforeAll(async () => {
        ctx = await createProtocolPluginContext()
        baseProtocolPlugin = new MakerProtocolPlugin()
        baseProtocolPlugin.init(ctx)
    })

    it('should throw a specific error when attempting to access the context (ctx) before the init() method has been called', () => {
        try {
            const uninitialisedBaseProtocolPlugin = new MakerProtocolPlugin()
            uninitialisedBaseProtocolPlugin.ctx
            assert.fail('Should throw error')
        } catch (error: unknown) {
            expect(getErrorMessage(error)).toEqual('Context (ctx) is not initialized. Please call init() with a valid context.')
        }
    })

    it('should allow access to the context (ctx) without throwing errors after the init() method has been successfully called', () => {
        expect(baseProtocolPlugin.ctx).toBe(ctx)
    })

    it('should correctly return the corresponding action builder for a given simulation step', () => {
        const actionBuilder = baseProtocolPlugin.getActionBuilder({type: SimulationSteps.PaybackWithdraw} as steps.PaybackWithdrawStep)
        assert(actionBuilder,'ActionBuilder is not defined')
    })
})
