const { ApolloError } = require('apollo-server'); // To handle Apollo errors
const Supplier = require('./models/supplier'); // Mongoose Supplier model
const Product = require('./models/product'); // Mongoose Product model
const grpc = require('@grpc/grpc-js'); // gRPC Client
const protoLoader = require('@grpc/proto-loader'); // To load Protobuf

// Load Protobuf files
const supplierProtoPath = './supplier.proto';
const productProtoPath = './product.proto';

// Load Protobuf definitions
const supplierProtoDefinition = protoLoader.loadSync(supplierProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Get gRPC services
const supplierProto = grpc.loadPackageDefinition(supplierProtoDefinition).supplier;
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

// Create gRPC clients
const clientSupplier = new supplierProto.SupplierService(
  'localhost:50053', // Address of the Supplier service
  grpc.credentials.createInsecure() // Credentials
);

const clientProduct = new productProto.ProductService(
  'localhost:50054', // Address of the Product service
  grpc.credentials.createInsecure() // Credentials
);

// GraphQL resolvers
const resolvers = {
  Query: {
    supplier: async (_, { id }) => {
      try {
        return await Supplier.findById(id); // Find supplier by ID
      } catch (error) {
        throw new ApolloError(`Error while searching for supplier: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    suppliers: async () => {
      try {
        return await Supplier.find(); // Find all suppliers
      } catch (error) {
        throw new ApolloError(`Error while searching for suppliers: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    product: async (_, { id }) => {
      try {
        return await Product.findById(id); // Find product by ID
      } catch (error) {
        throw new ApolloError(`Error while searching for product: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    products: async () => {
      try {
        return await Product.find(); // Find all products
      } catch (error) {
        throw new ApolloError(`Error while searching for products: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
  
  Mutation: {
    createSupplier: async (_, { name, description }) => {
      try {
        const newSupplier = new Supplier({ name, description });
        return await newSupplier.save(); // Save the supplier
      } catch (error) {
        throw new ApolloError(`Error while creating supplier: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    deleteSupplier: async (_, { id }) => {
      try {
        const supplier = await Supplier.findByIdAndDelete(id); // Delete by ID
        if (!supplier) {
          throw new ApolloError("Supplier not found", "NOT_FOUND");
        }
        return "Supplier deleted successfully";
      } catch (error) {
        throw new ApolloError(`Error while deleting supplier: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    updateSupplier: async (_, { id, name, description }) => {
      try {
        const supplier = await Supplier.findByIdAndUpdate(
          id,
          { name, description },
          { new: true } // Return the updated supplier
        );
        
        if (!supplier) {
          throw new ApolloError("Supplier not found", "NOT_FOUND");
        }
        
        return supplier; // Supplier updated
      } catch (error) {
        throw new ApolloError(`Error while updating supplier: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    createProduct: async (_, { name, description }) => {
      try {
        const newProduct = new Product({ name, description });
        return await newProduct.save(); // Save the product
      } catch (error) {
        throw new ApolloError(`Error while creating product: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    deleteProduct: async (_, { id }) => {
      try {
        const product = await Product.findByIdAndDelete(id); // Delete by ID
        if (!product) {
          throw new ApolloError("Product not found", "NOT_FOUND");
        }
        return "Product deleted successfully";
      } catch (error) {
        throw new ApolloError(`Error while deleting product: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    updateProduct: async (_, { id, name, description }) => {
      try {
        const product = await Product.findByIdAndUpdate(
          id,
          { name, description },
          { new: true } // Return the updated product
        );
        
        if (!product) {
          throw new ApolloError("Product not found", "NOT_FOUND");
        }
        
        return product; // Product updated
      } catch (error) {
        throw new ApolloError(`Error while updating product: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
};

module.exports = resolvers;
