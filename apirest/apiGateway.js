const express = require('express'); // Express Framework
const bodyParser = require('body-parser'); // To handle JSON
const cors = require('cors'); // To allow cross-origin requests

const connectDB = require('../config/database'); // Connect to MongoDB
const Fournisseur = require('../models/supplier'); // Supplier Model
const Produit = require('../models/product'); // Product Model

const app = express(); // Create Express application

// Connect to MongoDB
connectDB();

app.use(cors()); // Allow cross-origin requests
//(By default, the cors middleware allows requests from all origins, but you can configure it to only allow requests from specific origins,)
app.use(bodyParser.json()); // Handle JSON

// ****************Endpoints for suppliers*********************

// Get all the information of suppliers
exports.getSupplier = async(req, res) => {
   try {
    const suppliers = await Fournisseur.find(); // Get all the information of suppliers
    res.json(suppliers);
  } catch (err) {
    res.status(500).send("Error fetching suppliers: " + err.message);
  }
}

exports.getSupplierById = async(req, res) => {
  try {
    const supplier = await Fournisseur.findById(req.params.id); // Get a supplier by its id
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.json(supplier);
  } catch (err) {
    res.status(500).send("Error fetching supplier: " + err.message);
  }
}

exports.createSupplier = async(req, res) => {
  try {
    const { name, description } = req.body; // Get the info in the body of the request
    const newSupplier = new Fournisseur({ name, description }); // Create a new instance of the supplier
    const supplier = await newSupplier.save(); // Save the new supplier created

    res.json(supplier); // Return the created supplier object
  } catch (err) { // Handle the error if the new supplier is not created
    res.status(500).send("Error creating supplier: " + err.message);
  }
}

// Delete a supplier by its id
exports.deleteSupplierById = async(req, res) => {
  try {
    const supplierId = req.params.id; // Get the id of the specific supplier in the request parameters
    const supplier = await Fournisseur.findByIdAndDelete(supplierId); // Find and delete the specific supplier using the id

    if (!supplier) { 
      return res.status(404).send("Supplier not found"); // If the supplier with the specific id is not found in the db, return an error message
    }

    res.send("Supplier deleted successfully"); // If the delete operation was successful, the response will be "Supplier deleted successfully"
  } catch (err) {
    res.status(500).send("Error deleting supplier: " + err.message); // Handle the error if the new supplier is not deleted
  }
}
// Endpoint to update a supplier by ID
exports.updateSupplierById = async(req, res) => {
  try {
    const supplierId = req.params.id; // Get supplier ID
    const { name, description } = req.body; // Get update data

    const supplier = await Fournisseur.findByIdAndUpdate(
      supplierId, // Identify supplier to update
      { name, description }, // Data to update
      { new: true } // Return updated supplier
    );

    if (!supplier) {
      return res.status(404).send("Supplier not found"); // Handle case where supplier is not found
    }

    res.json(supplier); // Return updated supplier
  } catch (err) {
    res.status(500).send("Error updating supplier: " + err.message); // Handle errors
  }
}


// ********************Endpoints for products*************************
exports.getProduct = async(req, res) => {
  try {
    const products = await Produit.find(); // Get all products
    res.json(products);
  } catch (err) {
    res.status(500).send("Error fetching products: " + err.message);
  }
}

exports.getProductById = async(req, res) => {
  try {
    const product = await Produit.findById(req.params.id); // Get product by ID
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (err) {
    res.status(500).send("Error fetching product: " + err.message);
  }
}

exports.createProduct = async(req, res) => {
  try {
    const { name, description } = req.body;
    const newProduct = new Produit({ name, description });
    const product = await newProduct.save(); // Save product

    res.json(product); // Return created product
  } catch (err) {
    res.status(500).send("Error creating product: " + err.message);
  }
}

// Endpoint to delete a product by ID
exports.deleteProductById = async(req, res) => {
  try {
    const productId = req.params.id; // Product ID
    const product = await Produit.findByIdAndDelete(productId); // Delete by ID

    if (!product) {
      return res.status(404).send("Product not found"); // Handle case where product does not exist
    }

    res.send("Product deleted successfully"); // Confirmation message
  } catch (err) {
    res.status(500).send("Error deleting product: " + err.message); // Handle errors
  }
}



// Endpoint to update a product by ID
exports.updateProductById = async(req, res) => {
  try {
    const productId = req.params.id; // Get product ID
    const { name, description } = req.body; // Get update data

    const product = await Produit.findByIdAndUpdate(
      productId, // Identify product to update
      { name, description }, // Data to update
      { new: true } // Return updated product
    );

    if (!product) {
      return res.status(404).send("Product not found"); // Handle case where product is not found
    }

    res.json(product); // Return updated product
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message); // Handle errors
  }
}
