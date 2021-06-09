// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
  @dev test implementation of a stock tokenization contract. 
  It is ERC-1155 based and there is no initial supply.
  On deployment it mints the configurable base currency to the deployer.
  The base currency is ALWAYS ID ZERO.
  After, stock prices will be measured in this.
 */
contract StockFactory is ERC1155Upgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;
    uint256 public ENLISTED_STOCK_COUNTER;

    // constructor(
    //     bytes32 _baseCurrencyName,
    //     bytes32 _symbol,
    //     uint256 _initialSupply
    // ) ERC1155Upgradeable() {
    //     ENLISTED_STOCK_COUNTER = 1;
    //     totalBaseCurrencyName = _baseCurrencyName;
    //     totalBaseCurrencySymbol = _symbol;
    //     totalBaseCurrencySupply = _initialSupply;
    //     _mint(msg.sender, 0, _initialSupply, "");
    // }

    bytes32 totalBaseCurrencyName;
    bytes32 totalBaseCurrencySymbol;
    uint256 totalBaseCurrencySupply;

    mapping(bytes32 => Stock) public stockMap;
    bytes32[] stocks;
    mapping(uint256 => address) private enlisterMap;
    mapping(address => Investor) private investorMap;
    address[] investors;

    struct Stock {
        uint256 id;
        bytes32 ticker;
        bytes32 name;
        uint256 outstandingShares;
        uint256 price;
        address enlister;
        bool isValue;
    }

    struct Investor {
        bytes32 name;
        bool isValue;
    }

    event NewInvestor(address indexed investorAddress, bytes32 name);
    event NewStockListed(
        address indexed enlister,
        bytes32 ticker,
        uint256 initialShareCount,
        uint256 price
    );
    event NewOffering(
        address indexed newShareEmitter,
        uint256 id,
        uint256 increaseAmount
    );
    event FloatReduced(
        address indexed shareBurner,
        uint256 id,
        uint256 decreaseAmount
    );

    modifier onlyInvestors() {
        require(
            investorMap[msg.sender].isValue,
            "Please register as investor first!"
        );
        _;
    }

    modifier onlyEnlister(uint256 _id) {
        require(
            enlisterMap[_id] == msg.sender,
            "Access is restricted to enlister only!"
        );
        _;
    }

    modifier onlyUniqueTickers(bytes32 _ticker) {
        require(!stockMap[_ticker].isValue, "Ticker already used!");
        _;
    }

    // pseudo-constructor
    function initialize(
        bytes32 _baseCurrencyName,
        bytes32 _symbol,
        uint256 _initialSupply
    ) public initializer {
        ERC1155Upgradeable.__ERC1155_init("");
        __Ownable_init();
        ENLISTED_STOCK_COUNTER = 1;
        totalBaseCurrencyName = _baseCurrencyName;
        totalBaseCurrencySymbol = _symbol;
        totalBaseCurrencySupply = _initialSupply;
        _mint(msg.sender, 0, _initialSupply, "");
    }

    function mintBaseCoin(
        bytes32 _baseCurrencyName,
        bytes32 _symbol,
        uint256 _initialSupply
    ) public {
        ENLISTED_STOCK_COUNTER = 1;
        totalBaseCurrencyName = _baseCurrencyName;
        totalBaseCurrencySymbol = _symbol;
        totalBaseCurrencySupply = _initialSupply;
        _mint(msg.sender, 0, _initialSupply, "");
    }

    function renounceOwnership() public override onlyOwner {}

    function stocksLength() external view returns (uint256) {
        return stocks.length;
    }

    function investorsLength() external view returns (uint256) {
        return investors.length;
    }

    function baseCurrencyName() external view returns (bytes32) {
        return totalBaseCurrencyName;
    }

    function baseCurrencySymbol() external view returns (bytes32) {
        return totalBaseCurrencySymbol;
    }

    function baseCurrencySupply() external view returns (uint256) {
        return totalBaseCurrencySupply;
    }

    function stockId(bytes32 ticker) external view returns(uint256){
        return stockMap[ticker].id;
    }


    /** @dev Enlists the investor.
     * Adds it in the contract and mints the
     * initial Share Amount of tokens to the sender.
     */
    function enlistInvestor(bytes32 _name) external {
        require(
            msg.sender != address(this),
            "Address zero can't be an investor!"
        );
        Investor memory investor;
        investor.name = _name;
        investor.isValue = true;
        investorMap[msg.sender] = investor;
        investors.push(msg.sender);
        emit NewInvestor(msg.sender, _name);
    }

    /** @dev Creates the stock as struct.
     * Adds it in the contract and mints the
     * initial Share Amount of tokens to the sender.
     * Returns the ID of the stocks.
     */
    function createStock(
        bytes32 _ticker,
        bytes32 _name,
        uint256 _price,
        uint256 _initialShares
    ) external onlyInvestors() onlyUniqueTickers(_ticker) returns (uint256) {
        Stock memory stock;
        stock.name = _name;
        stock.price = _price;
        stock.outstandingShares = _initialShares;
        stock.enlister = msg.sender;
        stock.isValue = true;
        stock.id = ENLISTED_STOCK_COUNTER;

        stocks.push(_ticker);
        enlisterMap[ENLISTED_STOCK_COUNTER] = msg.sender;
        stockMap[_ticker] = stock;
        _mint(
            msg.sender,
            ENLISTED_STOCK_COUNTER++,
            stock.outstandingShares,
            ""
        );
        emit NewStockListed(msg.sender, _ticker, _initialShares, _price);
    }

    function decreaseSupply(uint256 _id, uint256 _amount)
        external
        onlyEnlister(_id)
    {
        _burn(msg.sender, _id, _amount);
        emit FloatReduced(msg.sender, _id, _amount);
    }

    function increaseSupply(uint256 _id, uint256 _amount)
        external
        onlyEnlister(_id)
    {
        _mint(msg.sender, _id, _amount, "");
        emit NewOffering(msg.sender, _id, _amount);
    }
}
