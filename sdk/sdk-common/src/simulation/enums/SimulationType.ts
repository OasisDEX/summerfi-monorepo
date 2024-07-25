/**
 * Type of simulation that the simulator accepts
 */
export enum SimulationType {
  /** Importing an external position into the Summer system */
  ImportPosition = 'ImportPosition',
  /** Refinance an existing position into another protocol */
  Refinance = 'Refinance',
  /** Depositing or withdrawing from the Earn Protocol */
  EarnProtocol = 'EarnProtocol',
}
