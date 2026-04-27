# KetCe (Ketering Ceria) Application

A production-ready catering order management system with WhatsApp integration, built with a clean modular monolith architecture.

## 🎯 Features (MVP - Phase 1)

- ✅ **Order Management**: Create, track, and manage catering orders
- ✅ **WhatsApp Integration**: Receive and send WhatsApp messages for orders
- ✅ **Web Dashboard**: Admin interface for order and product management
- ✅ **Multi-Channel Orders**: Orders from WhatsApp, Web, and future POS
- ✅ **Product Management**: Manage menu items and categories
- ✅ **Order Statistics**: Dashboard with revenue and order metrics
- ✅ **Event-Driven Architecture**: Async notifications with BullMQ

## 🏗️ Architecture

### Modular Monolith
- **Single codebase** for all services
- **Modular structure** for future scalability
- **Clean architecture**: Controller → Service → Repository
- **Event-driven** for async operations

### Modules
1. **Auth**: Authentication and authorization
2. **Users**: User and customer management
3. **Products**: Menu catalog and product groups
4. **Orders**: Core order management (multi-channel)
5. **WhatsApp**: Adapter for WhatsApp messaging
6. **Notifications**: Async notification queue
7. **Inventory** (Future): Inventory management
8. **POS** (Future): Point of Sale integration
9. **Common**: Shared database, events, utilities

## 💻 Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **Cache/Queue**: Redis + BullMQ
- **Validation**: class-validator
- **Authentication**: JWT

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL
- **Cache**: Redis

## 📁 Project Structure

```
ketce-app/
├── backend/
│   ├── src/
│   │   ├── common/              # Shared utilities
│   │   │   ├── database/        # Entities, migrations
│   │   │   ├── events/          # Event bus, event definitions
│   │   │   └── utils/           # Helpers, decorators
│   │   └── modules/
│   │       ├── auth/            # Authentication
│   │       ├── users/           # Users & customers
│   │       ├── products/        # Products & groups
│   │       ├── orders/          # Core order logic
│   │       ├── whatsapp/        # WhatsApp adapter
│   │       ├── notifications/   # Notification queue
│   │       ├── inventory/       # (Future)
│   │       └── pos/             # (Future)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/           # Main dashboard
│   │   ├── orders/              # Order creation
│   │   └── products/            # Product management
│   ├── components/              # Reusable components
│   ├── lib/                     # API client, utilities
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### With Docker (Recommended)

```bash
# Clone and navigate
cd ketce-app

# Start all services
docker-compose up

# Services will be available at:
# - Backend: http://localhost:3000
# - Frontend: http://localhost:3001
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### Local Development

#### Backend
```bash
cd backend

# Setup
npm install
cp .env.example .env
npm run start:dev
```

#### Frontend
```bash
cd frontend

# Setup
npm install
cp .env.example .env
npm run dev
```

## 📊 Database Schema

### Entities
- **Customer**: Customer information (phone, name, address, VIP flag)
- **ProductGroup**: Menu categories (Nasi, Curry, etc.)
- **Product**: Menu items with prices
- **Order**: Order header with status, source, totals
- **OrderItem**: Line items in an order
- **User**: Admin users

All entities use UUID primary keys and include timestamps.

## 🔄 Multi-Channel Order Flow

```
┌─────────────────────────────────────────────────────────┐
│  Order Input (WhatsApp / Web / Future POS)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  WhatsApp Adapter / Web Controller                      │
│  (Parse → Validate → Call Service)                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  OrderService.createOrder()                             │
│  (Multi-channel entry point)                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  1. Find/Create Customer                                │
│  2. Calculate Totals                                    │
│  3. Save Order to Database                              │
│  4. Publish Event: order.created                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Event Listeners (Async)                                │
│  - Send WhatsApp notification                           │
│  - Send email confirmation                              │
│  - Update inventory (future)                            │
└─────────────────────────────────────────────────────────┘
```

## 🔌 API Endpoints

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status
- `GET /api/orders/stats` - Get statistics

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/product-groups` - List categories

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### WhatsApp
- `POST /api/whatsapp/webhook` - Webhook for incoming messages

## 📱 WhatsApp Integration

### Message Format
```
Menu command:
  "menu"

Order command:
  "order <product_name> <quantity>"
  Example: "order Nasi Kuning 2"
```

### Flow
1. Webhook receives message from WhatsApp
2. WhatsApp service parses message
3. Calls OrderService.createOrder() with source="whatsapp"
4. Notification sent back to customer via WhatsApp

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=catering_user
DB_PASSWORD=catering_password
DB_DATABASE=ketce_catering

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

NODE_ENV=development
APP_PORT=3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing

```bash
cd backend
npm run test
npm run test:cov
```

## 📈 Future Features (Phase 2+)

- [ ] **Inventory Module**: Track stock and usage
- [ ] **POS Integration**: Integrate with physical POS systems
- [ ] **Payment Gateway**: Online payment processing
- [ ] **Analytics**: Detailed sales and order analytics
- [ ] **SMS Integration**: SMS notifications
- [ ] **Delivery Tracking**: Real-time delivery status
- [ ] **Customer Portal**: Self-service order tracking
- [ ] **Advanced Scheduling**: Order scheduling and planning

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d
```

### Environment for Production
- Change `NODE_ENV=production`
- Generate strong `JWT_SECRET`
- Use managed database (RDS, etc.)
- Use managed Redis (ElastiCache, etc.)
- Enable HTTPS
- Configure proper CORS

## 📝 Code Quality

- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Safety**: TypeScript strict mode
- **Validation**: DTO validation with class-validator
- **Error Handling**: Proper error types and status codes

## 🤝 Contributing

1. Keep modules independent
2. Follow clean architecture principles
3. Add tests for new features
4. Update documentation

## 📄 License

MIT
