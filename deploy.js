const Web3 = require("web3");
const HdWalletProvider = require("@truffle/hdwallet-provider");
const code = require("./compile");

const { abi, evm } = code;

const mnemonic =
  "lobster announce museum snake asset primary lawsuit punch pitch second same cause";

const provider = new HdWalletProvider({
  mnemonic: {
    phrase: mnemonic,
  },
  providerOrUrl:
    "https://rinkeby.infura.io/v3/9f3b35d192e648a4990b73f7aca0013d",
});

const web3 = new Web3(provider);

const deployLottery = async () => {
  const accounts = await web3.eth.getAccounts();

  const contract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "10000000",
    });

  console.log("Deployed contract address", contract.options.address);
  console.log("ABI Interface", abi);

  provider.engine.stop();
};

deployLottery();
