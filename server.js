import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// 1. Define schema (types & queries)
const typeDefs = `#graphql
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, warehouse: String, status: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, quantity: Int!, fromWarehouse: String!, toWarehouse: String!): Product!
  }
`

// 2. Mock data
const warehouses = [
  { "code": "LAX-A", "name": "Los Angeles A", "city": "Los Angeles", "country": "USA" },
  { "code": "NYC-B", "name": "New York B", "city": "New York", "country": "USA" },
  { "code": "CHI-C", "name": "Chicago C", "city": "Chicago", "country": "USA" },
  { "code": "BLR-A", "name": "Bangalore A", "city": "Bangalore", "country": "India" },
  { "code": "PNQ-C", "name": "Pune C", "city": "Pune", "country": "India" },
  { "code": "DEL-B", "name": "Delhi B", "city": "New Delhi", "country": "India" }
]

const products = [
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 }
]

const kpis = [
  { "date": "2025-01-01", "stock": 100, "demand": 80 },
  { "date": "2025-01-02", "stock": 120, "demand": 100 },
  { "date": "2025-01-03", "stock": 110, "demand": 90 },
]

// 3. Resolvers
const resolvers = {
  Query: {
    products: () => products,
    warehouses: () => warehouses,
    kpis: () => kpis,
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      product.demand = demand;
      return product;
    },
    transferStock: (_, { id, quantity, fromWarehouse, toWarehouse }) => {
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.warehouse !== fromWarehouse) {
        throw new Error('Product is not in the specified warehouse');
      }
      product.warehouse = toWarehouse;
      return product;
    },
  },
}

// 4. Start Apollo server
const server = new ApolloServer({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀 Mock GraphQL server ready at: ${url}`)
