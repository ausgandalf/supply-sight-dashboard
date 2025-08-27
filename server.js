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
    products(search: String, warehouse: String, status: String, page: Int, limit: Int): ProductConnection!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type ProductConnection {
    products: [Product!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
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
  { "id": "P-1005", "name": "Aluminum Sheet 2mm", "sku": "AL-002-500", "warehouse": "LAX-A", "stock": 150, "demand": 100 },
  { "id": "P-1006", "name": "Copper Wire 18AWG", "sku": "CW-018-100", "warehouse": "NYC-B", "stock": 300, "demand": 250 },
  { "id": "P-1007", "name": "Steel Pipe 1/2\"", "sku": "SP-050-250", "warehouse": "CHI-C", "stock": 75, "demand": 90 },
  { "id": "P-1008", "name": "Rubber Gasket", "sku": "GSK-001-1K", "warehouse": "BLR-A", "stock": 1000, "demand": 800 },
  { "id": "P-1009", "name": "LED Light 5W", "sku": "LED-005-50", "warehouse": "PNQ-C", "stock": 180, "demand": 180 },
  { "id": "P-1010", "name": "Circuit Board", "sku": "PCB-001-25", "warehouse": "DEL-B", "stock": 50, "demand": 60 },
  { "id": "P-1011", "name": "Power Supply 12V", "sku": "PS-012-100", "warehouse": "LAX-A", "stock": 120, "demand": 100 },
  { "id": "P-1012", "name": "Thermal Paste", "sku": "TP-001-50", "warehouse": "NYC-B", "stock": 80, "demand": 95 },
  { "id": "P-1013", "name": "Fan 120mm", "sku": "FAN-120-30", "warehouse": "CHI-C", "stock": 60, "demand": 75 },
  { "id": "P-1014", "name": "HDMI Cable 2m", "sku": "HDMI-2M-100", "warehouse": "BLR-A", "stock": 150, "demand": 130 },
  { "id": "P-1015", "name": "USB Cable Type-C", "sku": "USB-C-200", "warehouse": "PNQ-C", "stock": 400, "demand": 350 },
  { "id": "P-1016", "name": "Memory Card 32GB", "sku": "MC-032-50", "warehouse": "DEL-B", "stock": 100, "demand": 120 },
  { "id": "P-1017", "name": "Battery Pack", "sku": "BAT-001-40", "warehouse": "LAX-A", "stock": 80, "demand": 95 },
  { "id": "P-1018", "name": "Solar Panel 100W", "sku": "SP-100-10", "warehouse": "NYC-B", "stock": 20, "demand": 30 },
  { "id": "P-1019", "name": "Motor 24V DC", "sku": "MOT-024-25", "warehouse": "CHI-C", "stock": 40, "demand": 45 },
  { "id": "P-1020", "name": "Relay Switch", "sku": "RLS-001-100", "warehouse": "BLR-A", "stock": 200, "demand": 200 },
  { "id": "P-1021", "name": "Capacitor 100uF", "sku": "CAP-100-500", "warehouse": "PNQ-C", "stock": 1000, "demand": 850 },
  { "id": "P-1022", "name": "Resistor 10k", "sku": "RES-10K-1K", "warehouse": "DEL-B", "stock": 2000, "demand": 1800 },
  { "id": "P-1023", "name": "LCD Display 7\"", "sku": "LCD-007-20", "warehouse": "LAX-A", "stock": 30, "demand": 40 },
  { "id": "P-1024", "name": "Touch Sensor", "sku": "TS-001-100", "warehouse": "NYC-B", "stock": 150, "demand": 140 },
  { "id": "P-1025", "name": "WiFi Module", "sku": "WIFI-001-50", "warehouse": "CHI-C", "stock": 75, "demand": 75 },
  { "id": "P-1026", "name": "Bluetooth Adapter", "sku": "BT-001-100", "warehouse": "BLR-A", "stock": 120, "demand": 110 },
  { "id": "P-1027", "name": "GPS Module", "sku": "GPS-001-30", "warehouse": "PNQ-C", "stock": 45, "demand": 55 },
  { "id": "P-1028", "name": "Temperature Sensor", "sku": "TEMP-001-200", "warehouse": "DEL-B", "stock": 300, "demand": 300 },
  { "id": "P-1029", "name": "Pressure Sensor", "sku": "PRES-001-150", "warehouse": "LAX-A", "stock": 180, "demand": 180 },
  { "id": "P-1030", "name": "Motion Detector", "sku": "MOT-DET-75", "warehouse": "NYC-B", "stock": 90, "demand": 85 },
  { "id": "P-1031", "name": "LED Strip 5m", "sku": "LED-5M-40", "warehouse": "CHI-C", "stock": 60, "demand": 70 },
  { "id": "P-1032", "name": "Servo Motor", "sku": "SRV-001-50", "warehouse": "BLR-A", "stock": 70, "demand": 80 },
  { "id": "P-1033", "name": "Stepper Motor", "sku": "STP-001-40", "warehouse": "PNQ-C", "stock": 50, "demand": 60 },
  { "id": "P-1034", "name": "DC Motor 12V", "sku": "DCM-012-100", "warehouse": "DEL-B", "stock": 120, "demand": 110 },
  { "id": "P-1035", "name": "AC Motor 220V", "sku": "ACM-220-25", "warehouse": "LAX-A", "stock": 30, "demand": 35 },
  { "id": "P-1036", "name": "Power Adapter", "sku": "PA-001-150", "warehouse": "NYC-B", "stock": 180, "demand": 160 },
  { "id": "P-1037", "name": "Battery Charger", "sku": "BC-001-80", "warehouse": "CHI-C", "stock": 100, "demand": 90 },
  { "id": "P-1038", "name": "Solar Inverter", "sku": "SI-001-15", "warehouse": "BLR-A", "stock": 20, "demand": 25 },
  { "id": "P-1039", "name": "Voltage Regulator", "sku": "VR-001-200", "warehouse": "PNQ-C", "stock": 250, "demand": 220 },
  { "id": "P-1040", "name": "Current Sensor", "sku": "CS-001-100", "warehouse": "DEL-B", "stock": 120, "demand": 110 },
  { "id": "P-1041", "name": "Reed Switch", "sku": "RS-001-300", "warehouse": "LAX-A", "stock": 350, "demand": 300 },
  { "id": "P-1042", "name": "Toggle Switch", "sku": "TS-001-250", "warehouse": "NYC-B", "stock": 280, "demand": 260 },
  { "id": "P-1043", "name": "Push Button", "sku": "PB-001-500", "warehouse": "CHI-C", "stock": 600, "demand": 550 },
  { "id": "P-1044", "name": "Rotary Encoder", "sku": "RE-001-75", "warehouse": "BLR-A", "stock": 90, "demand": 85 },
  { "id": "P-1045", "name": "IR Sensor", "sku": "IR-001-150", "warehouse": "PNQ-C", "stock": 180, "demand": 160 },
  { "id": "P-1046", "name": "UV Sensor", "sku": "UV-001-100", "warehouse": "DEL-B", "stock": 120, "demand": 110 },
  { "id": "P-1047", "name": "Hall Sensor", "sku": "HS-001-200", "warehouse": "LAX-A", "stock": 240, "demand": 220 },
  { "id": "P-1048", "name": "Flex Sensor", "sku": "FS-001-50", "warehouse": "NYC-B", "stock": 60, "demand": 55 },
  { "id": "P-1049", "name": "Force Sensor", "sku": "FRS-001-75", "warehouse": "CHI-C", "stock": 90, "demand": 85 },
  { "id": "P-1050", "name": "Load Cell", "sku": "LC-001-40", "warehouse": "BLR-A", "stock": 50, "demand": 45 },
  { "id": "P-1051", "name": "Strain Gauge", "sku": "SG-001-100", "warehouse": "PNQ-C", "stock": 120, "demand": 110 },
  { "id": "P-1052", "name": "pH Sensor", "sku": "PH-001-25", "warehouse": "DEL-B", "stock": 30, "demand": 35 },
  { "id": "P-1053", "name": "Gas Sensor", "sku": "GS-001-60", "warehouse": "LAX-A", "stock": 70, "demand": 65 },
  { "id": "P-1054", "name": "Smoke Sensor", "sku": "SS-001-80", "warehouse": "NYC-B", "stock": 95, "demand": 90 },
  { "id": "P-1055", "name": "Water Level Sensor", "sku": "WLS-001-70", "warehouse": "CHI-C", "stock": 85, "demand": 80 },
  { "id": "P-1056", "name": "Color Sensor", "sku": "CS-001-45", "warehouse": "BLR-A", "stock": 55, "demand": 50 },
  { "id": "P-1057", "name": "Light Sensor", "sku": "LS-001-150", "warehouse": "PNQ-C", "stock": 180, "demand": 160 },
  { "id": "P-1058", "name": "Sound Sensor", "sku": "SND-001-100", "warehouse": "DEL-B", "stock": 120, "demand": 110 },
  { "id": "P-1059", "name": "Vibration Sensor", "sku": "VS-001-90", "warehouse": "LAX-A", "stock": 100, "demand": 95 },
  { "id": "P-1060", "name": "Tilt Sensor", "sku": "TLT-001-120", "warehouse": "NYC-B", "stock": 140, "demand": 130 },
  { "id": "P-1061", "name": "Proximity Sensor", "sku": "PRX-001-80", "warehouse": "CHI-C", "stock": 95, "demand": 90 },
  { "id": "P-1062", "name": "Humidity Sensor", "sku": "HUM-001-110", "warehouse": "BLR-A", "stock": 130, "demand": 120 },
  { "id": "P-1063", "name": "Accelerometer", "sku": "ACC-001-70", "warehouse": "PNQ-C", "stock": 85, "demand": 80 },
  { "id": "P-1064", "name": "Gyroscope", "sku": "GYR-001-60", "warehouse": "DEL-B", "stock": 70, "demand": 65 },
  { "id": "P-1065", "name": "Magnetometer", "sku": "MAG-001-50", "warehouse": "LAX-A", "stock": 60, "demand": 55 },
  { "id": "P-1066", "name": "Barometer", "sku": "BAR-001-40", "warehouse": "NYC-B", "stock": 50, "demand": 45 }
]

const kpis = [
  ...generateDailyKPIs(35).map(kpi => ({
    date: kpi.date,
    stock: kpi.stock,
    demand: kpi.demand
  })),
]

// Helper function to generate KPI data
function generateDailyKPIs(days) {
  const kpis = [];
  const baseStock = 100;
  const baseDemand = 80;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation to stock and demand
    const stockVariation = Math.floor(Math.random() * 40) - 20; // +/- 20
    const demandVariation = Math.floor(Math.random() * 30) - 15; // +/- 15
    
    kpis.push({
      date: date.toISOString().split('T')[0],
      stock: baseStock + stockVariation,
      demand: baseDemand + demandVariation
    });
  }
  
  return kpis;
}

// 3. Resolvers
const resolvers = {
  Query: {
    products: (_, { search, warehouse, status, page = 1, limit = 10 }) => {
      let filteredProducts = [...products];
      
      // Filter by search term
      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Filter by warehouse
      if (warehouse && warehouse !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.warehouse === warehouse);
      }
      
      // Filter by status
      if (status && status !== 'All') {
        filteredProducts = filteredProducts.filter(p => {
          const productStatus = p.stock > p.demand ? 'Healthy' : p.stock === p.demand ? 'Low' : 'Critical';
          return productStatus === status;
        });
      }
      
      // Calculate pagination
      const totalCount = filteredProducts.length;
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Get paginated results
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        totalCount,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        currentPage,
        totalPages
      };
    },
    warehouses: () => warehouses,
    kpis: (_, { range }) => {
      // Generate KPI data based on the requested range
      const data = [];
      const today = new Date();
      const rangeNum = parseInt(range) || 30;
      
      for (let i = rangeNum - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Calculate total stock and demand for this date
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const totalDemand = products.reduce((sum, p) => sum + p.demand, 0);
        
        // Simulate historical data with some variation
        const stockVariation = 0.9 + (Math.random() * 0.2); // 90-110% of current
        const demandVariation = 0.8 + (Math.random() * 0.4); // 80-120% of current
        
        data.push({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          stock: Math.round(totalStock * stockVariation),
          demand: Math.round(totalDemand * demandVariation),
        });
      }
      
      return data;
    },
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
