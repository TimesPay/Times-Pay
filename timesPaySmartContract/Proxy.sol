pragma solidity ^0.4.24;


contract Proxy {

    function () payable external {
        _fallback();
    }


    function _implementation() internal view returns (address);


    function _delegate(address implementation) internal {
        assembly {
        // Copy msg.data. We take full control of memory in this inline assembly
        // block because it will not return to Solidity code. We overwrite the
        // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize)

        // Call the implementation.
        // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas, implementation, 0, calldatasize, 0, 0)

        // Copy the returned data.
            returndatacopy(0, 0, returndatasize)

            switch result
            // delegatecall returns 0 on error.
            case 0 { revert(0, returndatasize) }
            default { return(0, returndatasize) }
        }
    }

    function _willFallback() internal {        
        _willFallback();
        _delegate(_implementation());
    }

    function _fallback() internal {
        _willFallback();
        _delegate(_implementation());
    }
}