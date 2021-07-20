pragma solidity >=0.4.21 <0.6.0;

interface IVerifier {
    function verifyTx(
            uint[2] calldata a,
            uint[2] calldata a_p,
            uint[2][2] calldata b,
            uint[2] calldata b_p,
            uint[2] calldata c,
            uint[2] calldata c_p,
            uint[2] calldata h,
            uint[2] calldata k,
            uint[2] calldata input
        ) external returns (bool r);
}
