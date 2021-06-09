const StockFactory = artifacts.require('StockFactory');

const utils = web3.utils;

const bscName = utils.asciiToHex('426173652043757272656e6379');
const bscSymbol = utils.asciiToHex('425343');
const bscSupply = utils.asciiToHex('10000000000000000000000000');

module.exports = async (deployer) => {
  deployer.deploy(StockFactory, bscName, bscSymbol, bscSupply);
};
