## Usage of HTTP requests
Http client is installed automatically in JetBrains IDEs, In VSCode you need to install it manually. [Link to extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Envs
By default, the `*.private.env.json` files are ignored by git. 
You need to create a file with the following name `get-morpho-rewards-function.private.env.json` and add the following content:
```json
{
  "dev": {
    "url": "{{YOUR_DEV_URL}}"
  }
}
``` 
