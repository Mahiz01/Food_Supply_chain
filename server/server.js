const express = require('express');
const {Web3} = require('web3');
const SupplyChain = require('../build/contracts/SupplyChain.json');

const app = express();
const PORT = 5000;

// Change this to your correct provider endpoint
// const web3 = new Web3("https://your-quiknode-endpoint"); // Use the QuikNode endpoint
const web3 = new Web3("http://127.0.0.1:8545"); // Use this if you're using Ganache locally

let supplyChainContract;

// Initialize the contract
async function initializeContract() {
    try {
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChain.networks[networkId];

        if (networkData) {
            supplyChainContract = new web3.eth.Contract(SupplyChain.abi, networkData.address);
            console.log("Contract initialized on network ID:", networkId);
        } else {
            throw new Error("Contract not deployed to the detected network.");
        }
    } catch (error) {
        console.error("Error initializing contract:", error.message);
        throw error;
    }
}

initializeContract();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
