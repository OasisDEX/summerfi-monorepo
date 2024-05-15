import { DOG_ABI, ILK_REGISTRY_ABI, JUG_ABI, SPOT_ABI, VAT_ABI } from './MakerABIS'

/**
 * @description Maker ABI map
 * ABIs for the different Maker contracts
 */
export const MakerAbiMap = {
  Dog: DOG_ABI,
  Vat: VAT_ABI,
  McdJug: JUG_ABI,
  Spot: SPOT_ABI,
  IlkRegistry: ILK_REGISTRY_ABI,
  Chainlog: null,
  CdpManager: null,
  GetCdps: null,
  Pot: null,
  End: null,
  McdGov: null,
  FlashMintModule: null,
} as const
