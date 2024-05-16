const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const connectDB = require('./config/database');
const express = require('express');
const app = express();
const apiRoutes = require('./apirest/apiGateway');

// Define RESTful routes for supplier operations
app.get('/supplier', apiRoutes.getSupplier);
app.get('/supplier/:id', apiRoutes.getSupplierById);
app.post('/supplier/create', apiRoutes.createSupplier);
app.delete('/supplier/delete/:id', apiRoutes.deleteSupplierById);
app.put('/supplier/update/:id', apiRoutes.updateSupplierById);

// Define RESTful routes for product operations
app.get('/product', apiRoutes.getProduct);
app.get('/product/:id', apiRoutes.getProductById);
app.post('/product/create', apiRoutes.createProduct);
app.delete('/product/delete/:id', apiRoutes.deleteProductById);
app.put('/product/update/:id', apiRoutes.updateProductById);

const cors = require('cors');
app.use(cors());

// Connect to the MongoDB database
connectDB();

// Create an Apollo GraphQL server
const server = new ApolloServer({ typeDefs, resolvers });

// Start the Apollo server
server.listen().then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});

// Start the Express API Gateway server
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway operational on port ${port}`); 
});
