# How to add a new SDK Service

### Steps

- Navigate to monorepo `root`
- Run `turbo gen` and select `service: Adds a new service to the SDK`
- Input a suitable name for the new service, in Pascal case (e.g. `MoneyProvider`)
- This will generate 2 new packages in `sdk`:
  - `sdk/money-provider-common`: Contains the common interfaces and types for the new service
  - `sdk/money-provider-service`: Contains the factory and the implementation of the new service
- Adjust at will
