# Supply Sight Dashboard

A modern React-based inventory management dashboard that provides real-time visibility into supply chain operations, stock levels, and demand forecasting.

## 🚀 Features

- **Real-time Inventory Tracking** - Monitor stock levels across multiple warehouses
- **Demand Management** - Track and update product demand requirements
- **Warehouse Operations** - Transfer stock between warehouses seamlessly
- **Interactive Charts** - Visualize stock vs. demand trends over time
- **Advanced Filtering** - Search and filter products by name, SKU, warehouse, and status
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **GraphQL API** - Modern API architecture for efficient data fetching

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: GraphQL with Apollo Server
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd supply-sigth-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### 4. Start the GraphQL Server
```bash
node server.js
```
The server will start on `http://localhost:4000`

### 5. Start the Development Server
```bash
npm run dev
```
The React app will start on `http://localhost:5173`

## 🏗️ Project Structure

```
supply-sigth-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── Filters.tsx     # Search and filter controls
│   │   ├── Header.tsx      # App header with date range selector
│   │   ├── InventoryChart.tsx # Stock vs demand charts
│   │   ├── KpiCard.tsx     # KPI display cards
│   │   ├── ProductDrawer.tsx # Product detail modal
│   │   ├── ProductsTable.tsx # Main data table
│   │   └── StatusPill.tsx  # Status indicator components
│   ├── hooks/
│   │   └── useInventory.ts # Custom hook for inventory management
│   ├── services/
│   │   └── api.ts          # GraphQL API service
│   ├── types.ts            # TypeScript type definitions
│   ├── constants.ts        # Application constants
│   └── App.tsx            # Main application component
├── server.js               # GraphQL server
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## 🔌 API Endpoints

### GraphQL Schema

The application uses GraphQL with the following main types:

- **Product**: Inventory items with stock and demand data
- **Warehouse**: Storage locations with geographic information
- **KPI**: Key performance indicators for tracking trends

### Available Queries
- `products(search, warehouse, status)` - Fetch filtered product data
- `warehouses` - Get all warehouse information
- `kpis(range)` - Retrieve performance metrics

### Available Mutations
- `updateDemand(id, demand)` - Update product demand
- `transferStock(id, quantity, fromWarehouse, toWarehouse)` - Transfer stock between warehouses

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. Customize the design by modifying:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and Tailwind imports

### Data Structure
Modify the mock data in `server.js` to match your actual inventory data structure.

## 📱 Usage

### Dashboard Overview
- **KPI Cards**: View total stock, demand, and fill rate at a glance
- **Trend Chart**: Analyze stock vs demand patterns over time
- **Product Table**: Browse and search through inventory items

### Managing Inventory
1. **View Details**: Click on any product row to open the detail drawer
2. **Update Demand**: Modify demand requirements directly in the drawer
3. **Transfer Stock**: Move inventory between warehouses as needed

### Filtering and Search
- Use the search bar to find products by name, SKU, or ID
- Filter by warehouse location
- Filter by stock status (Healthy, Low, Critical)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Configuration
Ensure your production environment has the correct `VITE_GRAPHQL_URL` pointing to your production GraphQL endpoint.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the GraphQL server console for API errors
- Verify environment variables are correctly set

## 🔄 Updates

Stay updated with the latest features and improvements by regularly pulling from the main branch:
```bash
git pull origin main
npm install
```
