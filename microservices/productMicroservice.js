const grpc = require('@grpc/grpc-js'); // For gRPC
const protoLoader = require('@grpc/proto-loader'); // For loading Protobuf
const mongoose = require('mongoose'); // For MongoDB
const Product = require('../models/product'); // Mongoose model for products

// Path to the Protobuf file for products
const productProtoPath = '../product.proto'; 

// Load the Protobuf
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the Product service from the gRPC package
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/managment') // Connect to MongoDB
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  });

// gRPC service implementation for products
const productService = {
  getProduct: async (call, callback) => {
    try {
      const productId = call.request.product_id;
      const product = await Product.findById(productId);

      if (!product) {
        return callback(new Error("Product not found"));
      }

      callback(null, { product }); // Return the found product
    } catch (err) {
      callback(new Error("Error fetching product: " + err.message)); // Handle errors
    }
  },

  searchProducts: async (call, callback) => {
    try {
      const products = await Product.find(); // Get all products
      callback(null, { products });
    } catch (err) {
      callback(new Error("Error fetching products: " + err.message)); // Handle errors
    }
  },

  createProduct: async (call, callback) => {
    try {
      const { name, description } = call.request; // Get request data
      // Check if name and description are provided and non-empty
      if (!name || !description) {
        throw new Error("Name and description are required.");
      }
      const newProduct = new Product({ name, description }); // Create a new product
      const product = await newProduct.save(); // Save the product
      callback(null, { product }); // Return the created product
    } catch (err) {
      callback(new Error("Error creating product: " + err.message)); // Handle errors
    }
  },
  updateProduct: async (call, callback) => {
    try {
      const { product_id, name, description } = call.request;
      const product = await Product.findByIdAndUpdate(
        product_id,
        { name, description },
        { new: true }
      );

      if (!product) {
        return callback(new Error("Product not found")); // If the product is not found
      }

      callback(null, { product }); // Updated product
    } catch (err) {
      callback(new Error("Error updating product: " + err.message)); // Handle errors
    }
  },
  deleteProduct: async (call, callback) => {
    try {
      const productId = call.request.product_id; // Product ID
      const product = await Product.findByIdAndDelete(productId); // Delete by ID

      if (!product) {
        return callback(new Error("Product not found")); // Handle case where product does not exist
      }

      callback(null, { message: "Product deleted successfully" }); // Success response
    } catch (err) {
      callback(new Error("Error deleting product: " + err.message)); // Handle errors
    }
  },
};

// Create the gRPC server
const server = new grpc.Server(); // Create a gRPC server
server.addService(productProto.ProductService.service, productService); // Add Product service

server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Failed to bind server:", err);
    return;
  }
  server.start();
  console.log(`Product service operational on port ${boundPort}`); // Service startup confirmation
});
