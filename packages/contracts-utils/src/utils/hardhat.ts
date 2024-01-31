import hre from "hardhat";

export async function verify(
  contractAddress: string,
  args: unknown[],
  contract: unknown = undefined
): Promise<boolean> {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      contract: contract,
    });
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}
