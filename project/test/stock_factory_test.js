const StockFactory = artifacts.require('StockFactory');
const truffleAsserts = require('truffle-assertions');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const utils = web3.utils;

let stockFactory;
let stockFactoryProxy;
let investor0;
let investor1;
let investor2;

const bscNameUtf = 'Base Currency';
const bscSymbolUtf = 'BSC';
const bscName = utils.asciiToHex(bscNameUtf);
const bscSymbol = utils.asciiToHex(bscSymbolUtf);
const bscSupply = '10000000000000000000000000';
const BSC_ID = '0';

const stockTickerUtf = 'AAPL';
const stockNameUtf = 'Apple';
const stockPrice = 12;
const initShares = 100000;

const investorUtf = 'Investor';
const investorHex = utils.asciiToHex(investorUtf);

contract('StockFactory', (accounts) => {
  it('should assert true', async function () {
    stockFactory = await StockFactory.deployed();
    return assert.isTrue(true);
  });

  beforeEach(async () => {
    stockFactory = await StockFactory.deployed();
    investor0 = accounts[0];
    investor1 = accounts[1];
    investor2 = accounts[2];

    await stockFactory.setApprovalForAll(stockFactory.address, true, {
      from: accounts[3],
    });

    await stockFactory.mintBaseCoin(bscName, bscSymbol, bscSupply, {
      from: accounts[3],
    });
    console.log('StockFactory address: ' + stockFactory.address);
    console.log('Investor0 address: ' + investor0.address);
    await stockFactory.safeTransferFrom(
      accounts[3],
      accounts[0],
      BSC_ID,
      '1000',
      utils.asciiToHex(''),
      {
        from: accounts[3],
      }
    );
    await stockFactory.safeTransferFrom(
      accounts[3],
      accounts[1],
      BSC_ID,
      '1000',
      utils.asciiToHex(''),
      {
        from: accounts[3],
      }
    );
    await stockFactory.safeTransferFrom(
      accounts[3],
      accounts[2],
      BSC_ID,
      '1000',
      utils.asciiToHex(''),
      {
        from: accounts[3],
      }
    );
  });
  it('should be upgradable but not at the same address', async () => {
    stockFactoryProxy = await deployProxy(
      StockFactory,
      [bscName, bscSymbol, bscSupply],
      { initializer: 'initialize' }
    );

    assert.notEqual(stockFactoryProxy.address, stockFactory.address);
  });

  it('should have correct number of stocks', async () => {
    const length = await stockFactory.stocksLength();
    const intVal = parseInt(length);
    assert.equal(0, intVal);
  });

  it('should have correct number of investors', async () => {
    const length = await stockFactory.investorsLength();
    const intVal = parseInt(length);
    assert.equal(0, intVal);
  });

  it('Should assert correct deployment', async () => {
    expect((await stockFactory.baseCurrencySupply()).toString()).to.equal(
      new utils.BN(bscSupply).toString()
    );
    expect(await utils.toUtf8(await stockFactory.baseCurrencyName())).to.equal(
      bscNameUtf
    );
    expect(
      await utils.toUtf8(await stockFactory.baseCurrencySymbol())
    ).to.equal(bscSymbolUtf);
  });

  it('should be able to enlist investor', async () => {
    const result = await stockFactory.enlistInvestor(investorHex, {
      from: accounts[1],
    });
    truffleAsserts.eventEmitted(
      result,
      'NewInvestor',
      (e) => {
        return (e.investorAddress =
          accounts[1] && utils.toUtf8(e.name) === investorUtf);
      },
      'Contract should emit the correct event'
    );
  });

  it('Should be able to create stock from the enlisted investor address', async () => {
    truffleAsserts.eventEmitted(
      await stockFactory.createStock(
        utils.asciiToHex(stockTickerUtf),
        utils.asciiToHex(stockNameUtf),
        stockPrice,
        initShares,
        {
          from: accounts[1],
        }
      ),

      'NewStockListed',
      (e) => {
        return (
          e.enlister == accounts[1] &&
          utils.toUtf8(e.ticker) == stockTickerUtf &&
          e.initialShareCount == initShares &&
          e.price == stockPrice
        );
      },
      'Should emit the correct new stock event'
    );
  });

  it('Should fail to create stock from a non-enlisted address', async () => {
    truffleAsserts.reverts(
      stockFactory.createStock(
        utils.asciiToHex(stockTickerUtf),
        utils.asciiToHex(stockNameUtf),
        stockPrice,
        initShares,
        {
          from: accounts[2],
        }
      ),
      'Please register as investor first!'
    );
  });

  it('Should fail to create duplicate stock from the enlisted investor address', async () => {
    truffleAsserts.reverts(
      stockFactory.createStock(
        utils.asciiToHex(stockTickerUtf),
        utils.asciiToHex(stockNameUtf),
        stockPrice,
        initShares,
        {
          from: accounts[1],
        }
      ),
      'Ticker already used!'
    );
  });

  it('The enlister should be able to decrease suppy', async () => {
    truffleAsserts.eventEmitted(
      await stockFactory.decreaseSupply(1, 300, {
        from: accounts[1],
      }),

      'FloatReduced',
      (e) => {
        return (
          e.shareBurner == accounts[1] && e.id == 1 && e.decreaseAmount == 300
        );
      },
      'Should emit the correct event!'
    );
  });

  it('Random should not be able to decrease suppy', async () => {
    truffleAsserts.reverts(
      stockFactory.decreaseSupply(1, 300, {
        from: accounts[2],
      }),
      'Access is restricted to enlister only!'
    );
  });

  it('The enlister should be able to increase suppy', async () => {
    truffleAsserts.eventEmitted(
      await stockFactory.increaseSupply(1, 300, {
        from: accounts[1],
      }),

      'NewOffering',
      (e) => {
        return (
          e.newShareEmitter == accounts[1] &&
          e.id == 1 &&
          e.increaseAmount == 300
        );
      },
      'Should emit the correct event!'
    );
  });

  it('Random should not be able to decrease suppy', async () => {
    truffleAsserts.reverts(
      stockFactory.increaseSupply(1, 300, {
        from: accounts[2],
      }),
      'Access is restricted to enlister only!'
    );
  });
});
