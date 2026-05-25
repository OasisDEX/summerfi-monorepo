import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// sst-utils.ts
var isPersistentStage = /* @__PURE__ */ __name((stage) => {
  const persistentStage = ["production", "staging", "development"];
  return persistentStage.includes(stage);
}, "isPersistentStage");
var isProductionStage = /* @__PURE__ */ __name((stage) => {
  const productionStage = ["production"];
  return productionStage.includes(stage);
}, "isProductionStage");

// sst-environment.ts
import { z } from "zod/v4";
var envSchema = z.object({
  COINGECKO_API_URL: z.string().nonempty(),
  COINGECKO_API_VERSION: z.string().nonempty(),
  COINGECKO_API_KEY: z.string().nonempty(),
  COINGECKO_API_AUTH_HEADER: z.string().nonempty(),
  COINGECKO_SUPPORTED_CHAIN_IDS: z.string().default(""),
  ONE_INCH_API_URL: z.string().nonempty(),
  ONE_INCH_API_VERSION: z.string().nonempty(),
  ONE_INCH_API_KEY: z.string().nonempty(),
  ONE_INCH_API_AUTH_HEADER: z.string().nonempty(),
  ONE_INCH_SWAP_CHAIN_IDS: z.string().default(""),
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS: z.string().default(""),
  ONE_INCH_EXCLUDED_SWAP_PROTOCOLS: z.string().default(""),
  ONE_INCH_API_SPOT_CHAIN_IDS: z.string().default(""),
  ONE_INCH_API_SPOT_URL: z.string().nonempty(),
  ONE_INCH_API_SPOT_VERSION: z.string().nonempty(),
  ONE_INCH_API_SPOT_KEY: z.string().nonempty(),
  ONE_INCH_API_SPOT_AUTH_HEADER: z.string().nonempty(),
  SUMMER_HUB_CHAIN_ID: z.string().nonempty(),
  SUMMER_DEPLOYED_CHAINS_ID: z.string().nonempty(),
  SUMMER_DEPLOYED_CHAINS_ID_INSTI: z.string().nonempty(),
  SUMMER_DEPLOYED_CHAINS_ID_DCA: z.string().nonempty(),
  SUMMER_DEPLOYMENT_CONFIG: z.string().nonempty(),
  FUNCTIONS_API_URL: z.string().nonempty(),
  PARTNERS_API_URL: z.string().nonempty(),
  EARN_PROTOCOL_DB_CONNECTION_STRING: z.string().nonempty(),
  EARN_PROTOCOL_DCA_COOKIE_PREFIX: z.string().nonempty(),
  EARN_PROTOCOL_JWT_SECRET: z.string().nonempty(),
  SDK_RPC_GATEWAY: z.string().nonempty(),
  SDK_SUBGRAPH_CONFIG: z.json(),
  SDK_SUBGRAPH_CONFIG_INSTI: z.json(),
  SDK_SUBGRAPH_CONFIG_DCA: z.json(),
  SDK_LOGGING_ENABLED: z.string().default("false"),
  SDK_DEBUG_ENABLED: z.string().default("false"),
  SDK_DISTRIBUTIONS_BASE_URL: z.string().nonempty(),
  SDK_DISTRIBUTIONS_FILES: z.string().default(""),
  SDK_NAMED_REFERRALS_FILE: z.string().nonempty(),
  SDK_USE_FORK: z.string().nonempty().default(""),
  SDK_FORK_CONFIG: z.string().default(""),
  SDK_DEPLOYED_VERSIONS_MAP: z.string().nonempty(),
  ENSO_API_KEY: z.string().nonempty(),
  ENSO_ROUTER_ADDRESS: z.string().nonempty(),
  COW_SWAP_API_KEY: z.string().nonempty()
});
var parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid environment variables:", z.prettifyError(parsedEnv.error));
  process.exit(1);
}
var environmentVariables = parsedEnv.data;
var sdkDeployedVersionsMap = z.string().nonempty().transform((str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("Error parsing SDK_DEPLOYED_VERSIONS_MAP:", str, error);
  }
}).pipe(z.json()).pipe(
  z.record(
    z.string().regex(/^v\d$/),
    z.string().regex(/^\d+\.\d+\.\d+$/, {
      error: 'SDK_DEPLOYED_VERSIONS_MAP values must be in the format "X.X.X"'
    }),
    {
      error: 'SDK_DEPLOYED_VERSIONS_MAP keys must be in the format "vX"'
    }
  )
).parse(parsedEnv.data.SDK_DEPLOYED_VERSIONS_MAP);

// sdk-client/bundle/package.json
var version = "2.3.0";

// create-backend.ts
import { Function } from "sst/constructs";
import { LoggingFormat } from "aws-cdk-lib/aws-lambda";
var createBackend = /* @__PURE__ */ __name(({
  stack,
  production,
  persistent,
  deployedVersion,
  sdkGateway,
  sdkBucket,
  vpc
}) => {
  if (!/^\d+\.\d+\.\d+$/.test(deployedVersion)) {
    throw new Error(`Deployed version tag "${deployedVersion}" is not in the format X.Y.Z`);
  }
  const apiVersion = `v${deployedVersion.charAt(0)}`;
  if (!/^v\d$/.test(apiVersion)) {
    throw new Error(`API version tag "${apiVersion}" is not in the format vX`);
  }
  const nameSuffix = deployedVersion.replaceAll(".", "x");
  const sdkBackend = new Function(stack, `SdkBackendV${nameSuffix}`, {
    handler: "sdk-router-function/src/index.handler",
    runtime: "nodejs22.x",
    timeout: "30 seconds",
    environment: environmentVariables,
    loggingFormat: LoggingFormat.JSON,
    logRetention: production ? "one_month" : persistent ? "one_week" : "one_day",
    currentVersionOptions: {
      provisionedConcurrentExecutions: production ? 10 : void 0
    },
    ...vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets]
      },
      securityGroups: [vpc.securityGroup]
    }
  });
  sdkBackend.bind([sdkBucket]);
  const optionsHandler = new Function(stack, `SdkOptionsHandlerV${nameSuffix}`, {
    handler: "sdk-router-function/src/options.handler",
    runtime: "nodejs22.x",
    timeout: "10 seconds",
    loggingFormat: LoggingFormat.JSON,
    logRetention: production ? "one_month" : persistent ? "one_week" : "one_day"
  });
  const pathOld = `/api/sdk/${apiVersion}`;
  const path = `/sdk/trpc/${apiVersion}`;
  sdkGateway.addRoutes(stack, {
    [`ANY ${pathOld}/{proxy+}`]: sdkBackend,
    [`ANY ${path}/{proxy+}`]: sdkBackend,
    [`OPTIONS ${pathOld}/{proxy+}`]: optionsHandler,
    [`OPTIONS ${path}/{proxy+}`]: optionsHandler
  });
  return {
    url: `${path}`
  };
}, "createBackend");

// sst.config.ts
import { Api, Bucket } from "sst/constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { config } from "@dotenvx/dotenvx";
config({ path: ["../.env", ".env"], override: true, debug: false, ignore: ["MISSING_ENV_FILE"] });
var sst_config_default = {
  config(input) {
    const stage = input.stage ?? `SST-v2-${process.env.SST_USER}`;
    if (!stage) {
      throw new Error("Please specify stage or set SST_USER env variable");
    }
    return {
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
      stage,
      // AWS CF stack name
      name: "versioned-sdk"
    };
  },
  stacks(app) {
    if (isPersistentStage(app.stage)) {
      app.setDefaultRemovalPolicy("retain");
    } else {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack((context) => {
      const { stack } = context;
      const persistent = isPersistentStage(app.stage);
      const production = isProductionStage(app.stage);
      const attachDbVpc = app.stage === "staging" || app.stage === "production";
      const vpc = (() => {
        if (!attachDbVpc) {
          return null;
        }
        const { VPC_ID, SECURITY_GROUP_ID } = process.env;
        if (!VPC_ID || !SECURITY_GROUP_ID) {
          throw new Error(
            "VPC_ID and SECURITY_GROUP_ID must be set for staging/production SDK deploys"
          );
        }
        return {
          vpc: ec2.Vpc.fromLookup(stack, "VPC", { vpcId: VPC_ID }),
          securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, "SG", SECURITY_GROUP_ID)
        };
      })();
      const deployedVersions = Object.values(sdkDeployedVersionsMap);
      if (!deployedVersions.includes(version)) {
        throw new Error(
          `Client pkg version ${version} is not in the list of deployed versions: ${deployedVersions.join(", ")}. Please update SDK_DEPLOYED_VERSIONS_MAP var in GitHub environment with a newly deployed version to allow deployment.`
        );
      }
      const sdkBucket = new Bucket(stack, "SdkBucket", {
        cdk: {
          bucket: {
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY
            // Optional: to clean up the bucket on stack deletion
          }
        }
      });
      const sdkGateway = new Api(stack, "SdkGateway", {
        accessLog: {
          retention: production ? "one_month" : persistent ? "one_week" : "one_day"
        }
      });
      const deployedPaths = [];
      for (const version2 of deployedVersions) {
        try {
          const { url } = createBackend({
            stack,
            deployedVersion: version2,
            production,
            persistent,
            sdkGateway,
            sdkBucket,
            vpc
          });
          deployedPaths.push(url);
        } catch (error) {
          console.error(`Failed to create backend for version ${version2}:`, error);
        }
      }
      console.log("\nVariables:", {
        FUNCTIONS_API_URL: process.env.FUNCTIONS_API_URL,
        PARTNERS_API_URL: process.env.PARTNERS_API_URL
      });
      stack.addOutputs({
        Stage: app.stage,
        DeployUrl: sdkGateway.url,
        DeployedVersions: deployedPaths.join(", ")
      });
    });
  }
};
export {
  sst_config_default as default
};
