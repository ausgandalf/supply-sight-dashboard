import { Product } from '../types';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

const graphqlRequest = async (query: string, variables?: any) => {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
};

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const query = `
      query GetProducts($search: String, $warehouse: String, $status: String) {
        products(search: $search, warehouse: $warehouse, status: $status) {
          id
          name
          sku
          warehouse
          stock
          demand
        }
      }
    `;
    
    const data = await graphqlRequest(query);
    return data.products;
  },

  async getWarehouses(): Promise<string[]> {
    const query = `
      query GetWarehouses {
        warehouses {
          code
          name
          city
          country
        }
      }
    `;
    
    const data = await graphqlRequest(query);
    return data.warehouses.map((w: any) => w.code);
  },

  async updateDemand(productId: string, newDemand: number): Promise<void> {
    const mutation = `
      mutation UpdateDemand($id: ID!, $demand: Int!) {
        updateDemand(id: $id, demand: $demand) {
          id
          demand
        }
      }
    `;
    
    await graphqlRequest(mutation, { id: productId, demand: newDemand });
  },

  async transferStock(productId: string, quantity: number, fromWarehouse: string, toWarehouse: string): Promise<void> {
    const mutation = `
      mutation TransferStock($id: ID!, $quantity: Int!, $fromWarehouse: String!, $toWarehouse: String!) {
        transferStock(id: $id, quantity: $quantity, fromWarehouse: $fromWarehouse, toWarehouse: $toWarehouse) {
          id
          warehouse
        }
      }
    `;
    
    await graphqlRequest(mutation, { 
      id: productId, 
      quantity, 
      fromWarehouse, 
      toWarehouse 
    });
  },
};