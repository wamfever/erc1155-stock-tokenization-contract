const StockFactory = artifacts.require('StockFactory');

const utils = web3.utils;

const bscName = utils.asciiToHex('Stock Tokenizer');
const bscSymbol = utils.asciiToHex('STC');
const bscSupply = utils.asciiToHex('10000000000000000000000000');

module.exports = async (deployer) => {
  deployer.deploy(StockFactory, bscName, bscSymbol, bscSupply);
};
