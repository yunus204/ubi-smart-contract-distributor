// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UBIDistributor {
    address public owner;
    uint256 public ubiAmount;

    mapping(address => bool) public eligible;
    mapping(address => bool) public hasReceived;

    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event EligibilityUpdated(address indexed user, bool eligible);
    event FundsDeposited(address indexed sender, uint256 amount);
    event UBIDistributed(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(uint256 _ubiAmount) {
        owner = msg.sender;
        ubiAmount = _ubiAmount;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    function setEligible(address user, bool status) external onlyOwner {
        require(user != address(0), "Invalid address");
        eligible[user] = status;
        emit EligibilityUpdated(user, status);
    }

    function setUbiAmount(uint256 _ubiAmount) external onlyOwner {
        require(_ubiAmount > 0, "Amount must be greater than zero");
        ubiAmount = _ubiAmount;
    }

    function distribute(address user) external onlyOwner {
        require(eligible[user], "User is not eligible");
        require(!hasReceived[user], "UBI already received");
        require(address(this).balance >= ubiAmount, "Insufficient contract balance");

        hasReceived[user] = true;

        (bool success, ) = payable(user).call{value: ubiAmount}("");
        require(success, "Transfer failed");

        emit UBIDistributed(user, ubiAmount);
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
