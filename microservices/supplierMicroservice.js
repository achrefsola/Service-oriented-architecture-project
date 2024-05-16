const grpc = require('@grpc/grpc-js'); // For gRPC
const protoLoader = require('@grpc/proto-loader'); // For loading Protobuf
const mongoose = require('mongoose'); // For MongoDB
const Supplier = require('../models/supplier'); // Mongoose model for suppliers

// Path to the Protobuf file
const supplierProtoPath = '../supplier.proto'; 

// Load the Protobuf
const supplierProtoDefinition = protoLoader.loadSync(supplierProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the Supplier service from the gRPC package
const supplierProto = grpc.loadPackageDefinition(supplierProtoDefinition).supplier;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/managment') // Use IPv4 to avoid issues
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process in case of error
  });

// gRPC service implementation for suppliers
const supplierService = {
  getSupplier: async (call, callback) => {
    try {
      const supplierId = call.request.supplier_id;
      const supplier = await Supplier.findById(supplierId);

      if (!supplier) {
        return callback(new Error("Supplier not found"));
      }

      callback(null, { supplier }); 
    } catch (err) {
      callback(new Error("Error fetching supplier")); 
    }
  },

  searchSuppliers: async (call, callback) => {
    try {
      const suppliers = await Supplier.find();
      callback(null, { suppliers });
    } catch (err) {
      callback(new Error("Error fetching suppliers")); 
    }
  },

  createSupplier: async (call, callback) => {
    try {
      const { name, description } = call.request;
      const newSupplier = new Supplier({ name, description });
      const supplier = await newSupplier.save();

      callback(null, { supplier }); 
    } catch (err) {
      callback(new Error("Error creating supplier")); 
    }
  },
  updateSupplier: async (call, callback) => {
    try {
      const { supplier_id, name, description } = call.request;
      const supplier = await Supplier.findByIdAndUpdate(
        supplier_id,
        { name, description },
        { new: true }
      );

      if (!supplier) {
        return callback(new Error("Supplier not found"));
      }

      callback(null, { supplier }); 
    } catch (err) {
      callback(new Error("Error updating supplier: " + err.message));
    }
  },
  deleteSupplier: async (call, callback) => {
    try {
      const supplierId = call.request.supplier_id;
      const supplier = await Supplier.findByIdAndDelete(supplierId);

      if (!supplier) {
        return callback(new Error("Supplier not found"));
      }

      callback(null, { message: "Supplier deleted successfully" }); 
    } catch (err) {
      callback(new Error("Error deleting supplier: " + err.message));
    }
    
  },  
};

// Create the gRPC server
const server = new grpc.Server();
server.addService(supplierProto.SupplierService.service, supplierService);

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Failed to bind server:", err);
    return;
  }
  server.start();
  console.log(`Supplier service operational on port ${boundPort}`);
});
