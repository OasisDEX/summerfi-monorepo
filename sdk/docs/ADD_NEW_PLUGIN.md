### How to add a new protocol plugin
This guide outlines how to add a new protocol plugin to the SDK.

### Steps
* Navigate to monorepo `root`
* Run `turbo gen` and select `plugin: Add a new protocol plugin`
* Input a suitable name for the new protocol
* Update `sdk/protocol-plugins/src/<PluginName>/Types.ts` by:
   - defining the Debt & Collateral Lending Pool Configs
   - updating the protocol specific abi map
* In `sdk/protocol-plugins/src/<PluginName>/<PluginName>ProtocolPlugin.ts`:
   - Implement `getPool`
   - Update ProtocolName enum
   - Update Plugin schema
   - Create a <PluginName>PoolId
* Add required ABIs in `sdk/protocol-plugins/src/<PluginName>/<PluginName>ProtocolPlugin.ts`
* Implement builders and actions (an example from MakerPaybackWithdraw is included in the template)