var CustomERC721Token = artifacts.require('CustomERC721Token');
const truffleAssert = require('truffle-assertions');

contract('TestERC721Mintable', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    let totalCount = 10;

    describe('match erc721 spec', function () {
        before(async function () { 
            // TODO: mint multiple tokens
            
            this.contract = await CustomERC721Token.deployed({from: account_one});
            try {
                for(let counter = 1; counter <= totalCount; counter++) {
                    await this.contract.mint(account_one, counter)
                }
            } catch (error) {
                console.log(error)
            }
        })

        it('should return total supply', async function () { 
            this.contract = await CustomERC721Token.deployed({from: account_one});

            let totalToken = await this.contract.totalSupply.call();

            assert.equal(totalToken.toNumber(), totalCount);
        })

        it('should get token balance', async function () { 
            this.contract = await CustomERC721Token.deployed({from: account_one});

            let balance = await this.contract.balanceOf(account_one);

            assert.equal(balance.toNumber(), totalCount)            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let expectedURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";

            this.contract = await CustomERC721Token.deployed({from: account_one})

            let tokenURI = await this.contract.tokenURI(1)

            assert.equal(tokenURI, expectedURI)    
        })

        it('should transfer token from one owner to another', async function () { 
            this.contract = await CustomERC721Token.deployed({from: account_one})
            let result 
            try {
                result = await this.contract.safeTransferFrom(account_one, account_two, 1)
            } catch (error) {
                console.log(error)
            }
            truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
                return ev.from === account_one && ev.to === account_two && ev.tokenId.toNumber() === 1;
            }); 
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.deployed({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await truffleAssert.reverts(
                this.contract.mint(account_one, 11, {from: account_two}),
                "Only the contract owner is allowed"
            );
        })

        it('should return contract owner', async function () { 
            let actualOwner = await this.contract.getOwner.call()

            assert.equal(account_one, actualOwner)    
        })

    });
})