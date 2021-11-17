# KS Tasks Project



Tasks smart-contract is deployed on Mumbai testnet 0xCac52Ac25540d7bb156F8b1103Fdd9a375d4701a.

1. Add Mumbai testnet on your Metamask with this [website](https://chainlist.org/) or [this one](https://docs.unbound.finance/guides/guide-to-accessing-polygon-testnet-and-how-to-use-unbound-faucet-tokens)
2. Get faucet MATICs on [this website](https://faucet.polygon.technology/).
3. Create .env file in the project's root:
```
PRIVATE_KEY=<private_key_your_wallet>
API_KEY=https://polygon-mumbai.infura.io/v3/<project_id>
```
5. Deploy the smart contract by running:
```
cd Solidity-tutorial/
npx hardhat run --network polygon deploy.js 
```
6. Run UI:
```
npm i
npm start
```

# Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
