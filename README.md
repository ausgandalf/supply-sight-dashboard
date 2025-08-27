# Supply Sight Dashboard

A modern React-based inventory management dashboard with real-time supply chain visibility, stock tracking, and demand forecasting.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create `.env` file in root directory:
   ```env
   VITE_GRAPHQL_URL=http://localhost:4000/
   ```

3. **Start GraphQL server and dev server**
  ```bash
   npm run dev
   ```
   GraphQL Server runs on `http://localhost:4000`
   
   App runs on `http://localhost:5173`

  **Or start them separately:**

   ```bash
   npm run dev:server
   ```
   Server runs on `http://localhost:4000`

   ```bash
   npm run dev:client
   ```
   App runs on `http://localhost:5173`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API**: GraphQL with Apollo Server
- **State**: React Hooks

## 🔌 API Endpoints

- **Products**: Filtered and paginated product data
- **Warehouses**: Warehouse location information
- **KPIs**: Historical stock vs demand trends
- **Mutations**: Update demand, transfer stock

## 🎯 Features

- Real-time inventory tracking
- Advanced filtering (search, warehouse, status)
- Server-side pagination
- Interactive charts and KPIs
- Stock transfer between warehouses
- Responsive design

## 🚀 Deployment

```bash
npm run build
```

Ensure production environment has correct `VITE_GRAPHQL_URL` pointing to your production GraphQL endpoint.
