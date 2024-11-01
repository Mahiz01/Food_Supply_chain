const {Web3} = require("web3");
const SupplyChain = require("../../build/contracts/SupplyChain.json");
const web3 = new Web3("http://127.0.0.1:8545"); // Connect to Ganache on specified port

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

// Call this function during server startup to initialize the contract
initializeContract();

// Endpoint to fetch a product by ID
async function getProduct(req, res) {
  const productId = req.params.id;

  try {
    const product = await supplyChainContract.methods.products(productId).call();
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product");
  }
}

// Endpoint to create a new product
async function createProduct(req, res) {
  const { name, ownerAddress } = req.body;

  try {
    const receipt = await supplyChainContract.methods
      .createProduct(name)
      .send({ from: ownerAddress });
    res.json(receipt);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product");
  }
}

// Export functions for use in routing
module.exports = {
  getProduct,
  createProduct,
};
