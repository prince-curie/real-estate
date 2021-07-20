// migrating the appropriate contracts
var Pairing = artifacts.require("./Pairing");
var SquareVerifier = artifacts.require("./Verifier");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var CustomERC721Token = artifacts.require("CustomERC721Token");
var Address = artifacts.require("Address");
var Counters = artifacts.require("Counters");
var SafeMath = artifacts.require("SafeMath");

module.exports = async function(deployer, network) {
  await deployer.deploy(Address);
  await deployer.deploy(Counters);
  await deployer.deploy(SafeMath);

  if(network == 'development') {
    await deployer.link(Address, CustomERC721Token);
    await deployer.link(Counters, CustomERC721Token);
    await deployer.link(SafeMath, CustomERC721Token);

    await deployer.deploy(CustomERC721Token);    
  } 
  
  await deployer.link(Address, SolnSquareVerifier);
  await deployer.link(Counters, SolnSquareVerifier);
  await deployer.link(SafeMath, SolnSquareVerifier);

  await deployer.deploy(Pairing);
  await deployer.link(Pairing, SquareVerifier);
  await deployer.deploy(SquareVerifier);

  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
};
