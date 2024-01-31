import type { DeploymentType } from "./types";
import { isProvider, isNetwork } from "./types";
import { Deployments } from "./deployment";

export function parseDeploymentName(deploymentName: string): DeploymentType {
  const [provider, network, config] = deploymentName.split(".");

  if (!isProvider(provider)) {
    throw new Error(`Invalid provider in deployment type: ${provider}`);
  }
  if (!isNetwork(network)) {
    throw new Error(`Invalid network in deployment type: ${network}`);
  }

  return {
    provider,
    network,
    config,
  };
}

export function getDeploymentType(): DeploymentType {
  const deploymentName = process.env.DEPLOYMENT_TYPE;

  if (!deploymentName) {
    throw new Error("DEPLOYMENT_TYPE environment variable is not set");
  }

  return Deployments.getDeploymentTypeFromName(deploymentName);
}
