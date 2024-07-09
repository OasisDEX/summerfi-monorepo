export interface AppRaysConfigType {
  products: Products;
}

export interface Products {
  borrow: ProductsConfig;
  multiply: ProductsConfig;
  earn: ProductsConfig;
}

export interface ProductsConfig {
  ethereum: ProductNetworkConfig[];
  base: ProductNetworkConfig[];
  arbitrum: ProductNetworkConfig[];
  optimism: ProductNetworkConfig[];
}

export interface ProductNetworkConfig {
  label: string;
  link: string;
  protocol: string;
}
export const emptyConfig = {
    products: {},
} as AppRaysConfigType & {
  error?: string
}