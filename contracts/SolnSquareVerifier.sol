pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./interfaces/IVerifier.sol";
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    IVerifier _verifier;
    string public name = "Curie";
    string public symbol = "Cur";

    constructor(address verifierContract) public {
        _verifier = IVerifier(verifierContract);
    }

// TODO define a solutions struct that can hold an index & an address
    struct Solutions {
        uint256 index;
        address owner;
        bytes32 proofHash;
    }

// TODO define an array of the above struct
    Solutions[] solutions;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => uint256) solutionStore;


// TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256, address);


// TODO Create a function to add the solutions to the array and emit the event
    function addSolution( bytes32 proofHash, address owner, uint256 index) internal {
        solutions.push(Solutions(index, owner, proofHash));

        emit SolutionAdded(index, owner);
    }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

    function mintCoin  (
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input,
            address owner
    ) public {
        require(_verifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), 'Verification failed.');

        bytes32 proofHash = keccak256(abi.encode(a, a_p, b, b_p, c, c_p, h, k, input));
        uint256 index = solutions.length + 1;

        if(solutions.length > 0) {
            require(solutionStore[proofHash] == 0, 'Solution is not unique.');
            solutionStore[proofHash] = index;
        }

        addSolution(proofHash, owner, index);

        super.mint(owner, index);
    }
}  

