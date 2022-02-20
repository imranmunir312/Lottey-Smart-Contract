// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.9.0;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function getAllPlayers() public view returns (address[] memory) {
        return players;
    }

    function enter() public payable {
        require(
            msg.value >= 0.01 ether,
            "You must enter with at least 0.01 ether"
        );

        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public restricted {
        uint256 winner = random() % players.length;
        payable(players[winner]).transfer(address(this).balance);
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
