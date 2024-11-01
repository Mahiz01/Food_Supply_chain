// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum State { Produced, InTransit, Delivered }

    struct Product {
        uint id;
        string name;
        State state;
        address producer;
        address owner;
        uint timestamp;
    }

    mapping(uint => Product) public products;
    uint public productCounter;

    event ProductCreated(uint id, string name, address producer);
    event StateUpdated(uint id, State state);

    // Function to create a new product
    function createProduct(string memory _name) public {
        productCounter++;
        products[productCounter] = Product({
            id: productCounter,
            name: _name,
            state: State.Produced,
            producer: msg.sender,
            owner: msg.sender,
            timestamp: block.timestamp // Set timestamp at product creation
        });

        emit ProductCreated(productCounter, _name, msg.sender);
    }

    // Function to update the state of an existing product
    function updateState(uint _id, State _state) public {
        Product storage product = products[_id];
        require(product.id != 0, "Product does not exist");
        require(product.owner == msg.sender, "Not the owner of the product");

        // Ensure valid state transition
        require(
            (product.state == State.Produced && _state == State.InTransit) ||
            (product.state == State.InTransit && _state == State.Delivered),
            "Invalid state transition"
        );

        // Update product state and, optionally, ownership
        product.state = _state;
        
        // Emit an event after updating state
        emit StateUpdated(_id, _state);
    }

    // Function to query products by name and state
    function queryProductsByNameAndState(string memory _name, State _state) public view returns (Product[] memory) {
        uint count = 0;

        // Count the number of matching products
        for (uint i = 1; i <= productCounter; i++) {
            if (keccak256(bytes(products[i].name)) == keccak256(bytes(_name)) && products[i].state == _state) {
                count++;
            }
        }

        // Initialize the array of results
        Product[] memory result = new Product[](count);
        uint index = 0;

        // Populate the result array with matching products
        for (uint i = 1; i <= productCounter; i++) {
            if (keccak256(bytes(products[i].name)) == keccak256(bytes(_name)) && products[i].state == _state) {
                result[index] = products[i];
                index++;
            }
        }

        return result;
    }
}
