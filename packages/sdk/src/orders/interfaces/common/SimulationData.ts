import { Position } from "~sdk";

/**
 * @interface SimulationData
 * @description Simulation data for an order. To be specialized into the different types of simulations needed
 */
export interface SimulationData {
  sourcePosition: Position
  targetPosition: Position
}
