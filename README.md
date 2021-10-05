# oauth-mock-resource-server

An OAuth2 mock resource server to test Oauth2 client implementations. Expects an JWT as Bearer-Token in each request and can validate this token either agains a given key, or get a key from an identity provider supporting OICD discovery.

## Usage

You can start the mock server with 
```bash
npm start
```
There are two environment variables to change its behavior:
* ```KEY``` if this variable is set, this key will be used to validate JWT signatures. If not, the public keys are fetched from the issuer using OIDC discovery
* ```ISSUER``` if given the public keys are fetched from this issuer instead of the issuer in the JWT

## Built With

* [TypeScript](https://www.typescriptlang.org/) - JavaScript that scales
* [Epress](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
  * [TypeScript Express Starter](https://github.com/ljlm0402/typescript-express-starter) - Express RESTful API Boilerplate Using TypeScript
* [Jest](https://jestjs.io/) - Delightful JavaScript Testing
  * [ts-jest](https://kulshekhar.github.io/ts-jest) - TypeScript preprocessor for jest
* [eslint](https://eslint.org/) - Find and fix problems in your JavaScript code
  * [prettier](https://prettier.io/) - Opinionated code formatter
* [vscode](https://code.visualstudio.com/) - Code Editing. Redefined

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](LICENSE)