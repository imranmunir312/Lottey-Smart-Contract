const fs = require("fs");
const path = require("path");
const solc = require("solc");

const contract = fs.readFileSync(
  path.resolve("contract", "Lottery.sol"),
  "utf8"
);

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: contract,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = compiledContract.contracts["Lottery.sol"].Lottery;
