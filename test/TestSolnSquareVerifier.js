const fs = require('fs');
const path = require('path');
const truffleAssert = require('truffle-assertions');

let SolnSquareVerifier = artifacts.require('SolnSquareVerifier')

let proofDirectory = path.join(__dirname, path.normalize("../zokrates/code/square/proof.json"))
let {proof, input} = JSON.parse(fs.readFileSync(proofDirectory))

contract('SolnSquareVerifier', accounts =>{
    beforeEach(async () => {
        this.contract = await SolnSquareVerifier.deployed()
    })

    describe('test SolnSquareVerifier', () => {
        it('test if a solution can be added', async () => {
            let result = await this.contract.mintCoin(proof.A, proof.A_p, proof.B, proof.B_p, proof.C, 
                proof.C_p, proof.H, proof.K, input, accounts[3]
            )

            truffleAssert.eventEmitted(result, 'SolutionAdded', (ev) => {
                return ev['1'] === accounts[3];
            });
        })

        it('Test if an ERC721 token can be minted', async () => {
            let balance = await this.contract.balanceOf(accounts[4]);

            let result = await this.contract.mintCoin(proof.A, proof.A_p, proof.B, proof.B_p, proof.C, 
                proof.C_p, proof.H, proof.K, input, accounts[4]
            )

            let newBalance = await this.contract.balanceOf(accounts[4]);
            let increase = newBalance.toNumber() - balance.toNumber();

            truffleAssert.eventEmitted(result, 'Transfer');
            assert.equal(increase, 1)
        })
    })
})

// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
