const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  """
  //Represents a supplier entity.
  """
  type Supplier {
    id: String!
    name: String!
    description: String!
  }

  """
 // Represents a product entity.
  """
  type Product {
    id: String!
    name: String!
    description: String!
  }

  type Query {
    """
   // Get a supplier by ID.
    """
    supplier(id: String!): Supplier

    """
   // Get all suppliers.
    """
    suppliers: [Supplier]

    """
    //Get a product by ID.
    """
    product(id: String!): Product

    """
    //Get all products.
    """
    products: [Product]
  }
  
  type Mutation { 
    """
    //Create a new supplier.
    """
    createSupplier(name: String!, description: String!): Supplier

    """
    //Delete a supplier by ID.
    """
    deleteSupplier(id: String!): String

    """
    //Create a new product.
    """
    createProduct(name: String!, description: String!): Product

    """
    //Delete a product by ID.
    """
    deleteProduct(id: String!): String

    """
    //Update a supplier by ID.
    """
    updateSupplier(id: String!, name: String!, description: String!): Supplier

    """
    //Update a product by ID.
    """
    updateProduct(id: String!, name: String!, description: String!): Product
  }
`;

module.exports = typeDefs;
