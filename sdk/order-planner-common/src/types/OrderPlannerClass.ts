import { IOrderPlanner } from '../interfaces/IOrderPlanner'

/**
 * Type for the class of an Order Planner
 */
export type OrderPlannerClass = new () => IOrderPlanner
