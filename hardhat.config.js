require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const path = require("path");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  contracts_build_directory: path.join(__dirname, "contracts"),
  solidity: "0.8.4",
  networks: {
    development: {
      url: `http://localhost:8545`,
      network_id: "*"
    },
    polygon: {
      url: process.env.API_KEY,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
