const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", (accounts) => {
  it("should create a product", async () => {
    const instance = await SupplyChain.deployed();
    await instance.createProduct("Apples", { from: accounts[0] });
    const product = await instance.products(1);
    assert.equal(product.name, "Apples", "The product name should be Apples");
  });
});
