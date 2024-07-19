/**
 * Supported contract types for requesting ABIs
 */
export enum AbiContractType {
  /** Standard ERC20 interface */
  ERC20 = 'ERC20',
  /** Standard ERC4626 interface */
  ERC4626 = 'ERC4626',
  /** Standard FleetCommander interface for the Summer Earn Protocol */
  EarnProtocolFleetCommander = 'EarnProtocolFleetCommander',
}
