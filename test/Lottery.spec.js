const Ganache = require("ganache");
const Web3 = require("web3");
const assert = require("assert");
const { it, describe, beforeEach } = require("mocha");
const Lottery = require("../compile");

const web3 = new Web3(Ganache.provider());

let accounts, contract;
const { evm, abi } = Lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  contract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Lottery", () => {
  it("should deploy a contract", () => {
    assert.ok(contract.options.address);
  });

  it("Should return manager address", async () => {
    const manager = await contract.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });

  it("Should not enter lottery", async () => {
    try {
      await Promise.all(
        accounts.slice(0, 5).map((account) =>
          contract.methods.enter().send({
            from: account,
            value: web3.utils.toWei("0.001", "ether"),
          })
        )
      );
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Should enter lottery", async () => {
    const investment = await Promise.all(
      accounts
        .slice(5, accounts.length)
        .map((account) =>
          contract.methods
            .enter()
            .send({ from: account, value: web3.utils.toWei("0.01", "ether") })
        )
    );

    assert.ok(investment);
  });

  it("No one other than manager can pick winner", async () => {
    try {
      await contract.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Send money to the winner and reset players", async () => {
    await contract.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
    const currentBalance = await web3.eth.getBalance(accounts[0]);

    await contract.methods.pickWinner().send({ from: accounts[0] });

    const winnerBalance = await web3.eth.getBalance(accounts[0]);

    const difference = winnerBalance - currentBalance;

    assert(difference > web3.utils.toWei("0.8", "ether"));
  });
});
