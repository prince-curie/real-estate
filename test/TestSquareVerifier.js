// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
const fs = require('fs');
const path = require('path');
const truffleAssert = require('truffle-assertions');

var Verifier = artifacts.require('Verifier');

let proofDirectory = path.join(__dirname, path.normalize("../zokrates/code/square/proof.json"))
let {proof, input} = JSON.parse(fs.readFileSync(proofDirectory))

contract('Verifier', account => {
    beforeEach(async () => {
        this.contract = await Verifier.deployed()
    })

    // Test verification with correct proof
    describe('test verification', () => {
        // - use the contents from proof.json generated from zokrates steps
        it('should emit the Verified event with correct proof', async () => {
            const result = await this.contract.verifyTx(
                proof.A, proof.A_p, proof.B, proof.B_p, proof.C, 
                proof.C_p, proof.H, proof.K, input
            )

            truffleAssert.eventEmitted(result, 'Verified', (ev) => {
                return ev.s === "Transaction successfully verified.";
            });
        })
        
        // Test verification with incorrect proof
        it('should not emit the Verified event with correct proof', async () => {
            proof.A[0] = proof.A[0].slice(0, proof.A[0].length - 1);
            proof.A[0] = proof.A[0] + '3'
            
            let errorThrown = false

            try {
                const result = await this.contract.verifyTx(
                    proof.A, proof.A_p, proof.B, proof.B_p, proof.C, 
                    proof.C_p, proof.H, proof.K, input
                )
            } catch (error) {
                errorThrown = true
            }
            
            assert.equal(errorThrown, true)

        })
    })  
})
