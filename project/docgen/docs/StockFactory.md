test implementation of a stock tokenization contract. 

  It is ERC-1155 based and there is no initial supply.

  On deployment it mints the configurable base currency to the deployer.

  The base currency is ALWAYS ID ZERO.

  After, stock prices will be measured in this.

  # Functions:

      - [`initialize(bytes32 _baseCurrencyName, bytes32 _symbol, uint256 _initialSupply)`](#StockFactory-initialize-bytes32-bytes32-uint256-)

      - [`mintBaseCoin(bytes32 _baseCurrencyName, bytes32 _symbol, uint256 _initialSupply)`](#StockFactory-mintBaseCoin-bytes32-bytes32-uint256-)

      - [`renounceOwnership()`](#StockFactory-renounceOwnership--)

      - [`stocksLength()`](#StockFactory-stocksLength--)

      - [`investorsLength()`](#StockFactory-investorsLength--)

      - [`baseCurrencyName()`](#StockFactory-baseCurrencyName--)

      - [`baseCurrencySymbol()`](#StockFactory-baseCurrencySymbol--)

      - [`baseCurrencySupply()`](#StockFactory-baseCurrencySupply--)

      - [`stockId(bytes32 ticker)`](#StockFactory-stockId-bytes32-)

      - [`enlistInvestor(bytes32 _name)`](#StockFactory-enlistInvestor-bytes32-)

      - [`createStock(bytes32 _ticker, bytes32 _name, uint256 _price, uint256 _initialShares)`](#StockFactory-createStock-bytes32-bytes32-uint256-uint256-)

      - [`decreaseSupply(uint256 _id, uint256 _amount)`](#StockFactory-decreaseSupply-uint256-uint256-)

      - [`increaseSupply(uint256 _id, uint256 _amount)`](#StockFactory-increaseSupply-uint256-uint256-)

  # Events:

    - [`NewInvestor(address investorAddress, bytes32 name)`](#StockFactory-NewInvestor-address-bytes32-)

    - [`NewStockListed(address enlister, bytes32 ticker, uint256 initialShareCount, uint256 price)`](#StockFactory-NewStockListed-address-bytes32-uint256-uint256-)

    - [`NewOffering(address newShareEmitter, uint256 id, uint256 increaseAmount)`](#StockFactory-NewOffering-address-uint256-uint256-)

    - [`FloatReduced(address shareBurner, uint256 id, uint256 decreaseAmount)`](#StockFactory-FloatReduced-address-uint256-uint256-)

    # Function `initialize(bytes32 _baseCurrencyName, bytes32 _symbol, uint256 _initialSupply)` {#StockFactory-initialize-bytes32-bytes32-uint256-}

    No description

    # Function `mintBaseCoin(bytes32 _baseCurrencyName, bytes32 _symbol, uint256 _initialSupply)` {#StockFactory-mintBaseCoin-bytes32-bytes32-uint256-}

    No description

    # Function `renounceOwnership()` {#StockFactory-renounceOwnership--}

    No description

    # Function `stocksLength() → uint256` {#StockFactory-stocksLength--}

    No description

    # Function `investorsLength() → uint256` {#StockFactory-investorsLength--}

    No description

    # Function `baseCurrencyName() → bytes32` {#StockFactory-baseCurrencyName--}

    No description

    # Function `baseCurrencySymbol() → bytes32` {#StockFactory-baseCurrencySymbol--}

    No description

    # Function `baseCurrencySupply() → uint256` {#StockFactory-baseCurrencySupply--}

    No description

    # Function `stockId(bytes32 ticker) → uint256` {#StockFactory-stockId-bytes32-}

    No description

    # Function `enlistInvestor(bytes32 _name)` {#StockFactory-enlistInvestor-bytes32-}

    Enlists the investor.

Adds it in the contract and mints the

initial Share Amount of tokens to the sender.

    # Function `createStock(bytes32 _ticker, bytes32 _name, uint256 _price, uint256 _initialShares) → uint256` {#StockFactory-createStock-bytes32-bytes32-uint256-uint256-}

    Creates the stock as struct.

Adds it in the contract and mints the

initial Share Amount of tokens to the sender.

Returns the ID of the stocks.

    # Function `decreaseSupply(uint256 _id, uint256 _amount)` {#StockFactory-decreaseSupply-uint256-uint256-}

    No description

    # Function `increaseSupply(uint256 _id, uint256 _amount)` {#StockFactory-increaseSupply-uint256-uint256-}

    No description

  # Event `NewInvestor(address investorAddress, bytes32 name)` {#StockFactory-NewInvestor-address-bytes32-}

  No description

  # Event `NewStockListed(address enlister, bytes32 ticker, uint256 initialShareCount, uint256 price)` {#StockFactory-NewStockListed-address-bytes32-uint256-uint256-}

  No description

  # Event `NewOffering(address newShareEmitter, uint256 id, uint256 increaseAmount)` {#StockFactory-NewOffering-address-uint256-uint256-}

  No description

  # Event `FloatReduced(address shareBurner, uint256 id, uint256 decreaseAmount)` {#StockFactory-FloatReduced-address-uint256-uint256-}

  No description
