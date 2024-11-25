// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    // Mapping to store balances of each user
    mapping(address => uint256) private balances;

    // Function to add balance
    function AddBalance(uint256 amount, address account) public {
        require(amount > 0, "Amount must be greater than zero");
        balances[account] += amount;
    }

    // Function to remove balance
    function RemoveBalance(uint256 amount, address account) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balances[account] >= amount, "Insufficient balance");
        balances[account] -= amount;
    }

    // Function to show the balance of the caller
    function ShowBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}
