# summerfi-api

## Lambdas

All lambdas should have a handler at index.handler.

## Build artifacts from sources

Run `npm run build` in this folder to build all lambdas or you can build each one separately by
using it's own command, check `package.json` scripts.

Build artifacts will be outputted to the `/artifacts` folder, as separate zip files for each lambda
function.

## Create a new lambda

- Create a new folder in `lambdas/lib` folder
-

## Deploying using SST
We currently have three stages: dev, staging and production.
