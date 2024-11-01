const express = require("express");
const router = express.Router();
const supplyChainController = require("../controllers/supplyChainController");

// Define routes
router.get("/product/:id", supplyChainController.getProduct);
router.post("/product", supplyChainController.createProduct);

module.exports = router;
