# Development Setup Guide

## Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose
- PostgreSQL client (optional, for CLI access)
- Git

## Option 1: Docker Setup (Recommended)

### Quick Start
```bash
# Clone repository
git clone <repo>
cd ketce-app

# Start all services
docker-compose up

# Services will be available at:
# Backend: http://localhost:3000
# Frontend: http://localhost:3001
# Database: localhost:5432
# Redis: localhost:6379
```

### Verify Services
```bash
# Check logs
docker-compose logs -f

# Access database
psql -h localhost -U catering_user -d ketce_catering

# Check Redis
redis-cli -h localhost ping
```

### Common Commands
```bash
# Stop services
docker-compose down

# Rebuild services
docker-compose build

# View logs
docker-compose logs backend
docker-compose logs frontend

# Scale services
docker-compose up --scale backend=2
```

---

## Option 2: Local Development

### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Edit .env and set:
#    - DB_HOST=localhost (if using local postgres)
#    - REDIS_HOST=localhost (if using local redis)

# 4. Start PostgreSQL (Docker)
docker run -d \
  --name ketce_postgres \
  -e POSTGRES_USER=catering_user \
  -e POSTGRES_PASSWORD=catering_password \
  -e POSTGRES_DB=ketce_catering \
  -p 5432:5432 \
  postgres:16-alpine

# 5. Start Redis (Docker)
docker run -d \
  --name ketce_redis \
  -p 6379:6379 \
  redis:7-alpine

# 6. Run in development mode
npm run start:dev

# Backend running on http://localhost:3000
```

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Edit .env.local and set API URL
#    NEXT_PUBLIC_API_URL=http://localhost:3000

# 4. Run in development mode
npm run dev

# Frontend running on http://localhost:3001
```

---

## Database Setup

### With Docker
```bash
# Already done by docker-compose
# Connect to database
docker-compose exec postgres psql -U catering_user -d ketce_catering
```

### Manually
```bash
# Create database
createdb -U catering_user ketce_catering

# Connect
psql -h localhost -U catering_user -d ketce_catering

# Exit
\q
```

### View Database
```bash
# List tables
\dt

# View users table
SELECT * FROM "user";

# View orders
SELECT * FROM "order";
```

---

## Testing

### Backend Unit Tests
```bash
cd backend

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

### Backend E2E Tests
```bash
npm run test:e2e
```

---

## Debugging

### Backend (VS Code)
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "NestJS Debug",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "start:debug"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "cwd": "${workspaceFolder}/backend"
}
```

Then press F5 to start debugging.

### Frontend (VS Code)
```bash
npm run dev -- --debug
```

### Database Queries
```bash
# Enable query logging (backend)
# Set LOG_LEVEL=debug in .env
```

---

## API Testing

### Using curl
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Get orders (with token)
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import [API.md](./API.md) as reference
2. Create environment with:
   - `baseUrl`: http://localhost:3000
   - `token`: (set after login)
3. Create requests for each endpoint

### Using VS Code REST Client
Create `requests.http` in root:
```http
### Register
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

### Get Orders
GET http://localhost:3000/api/orders
Authorization: Bearer YOUR_TOKEN
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :3001
lsof -i :5432
lsof -i :6379

# Kill process
kill -9 <PID>
```

### Database Connection Refused
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Try connecting manually
psql -h localhost -U catering_user -d ketce_catering
```

### Redis Connection Error
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -h localhost ping
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Compilation Error
```bash
# Clear cache
cd backend
npm run build -- --clearCache

# Check tsconfig
npx tsc --noEmit
```

---

## Environment Variables

### Backend .env
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=catering_user
DB_PASSWORD=catering_password
DB_DATABASE=ketce_catering

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h

# App
NODE_ENV=development
APP_PORT=3000
FRONTEND_URL=http://localhost:3001

# Logging
LOG_LEVEL=debug
```

### Frontend .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Code Quality

### Linting
```bash
cd backend
npm run lint

cd frontend
npm run lint
```

### Formatting with Prettier
```bash
cd backend
npm run format

cd frontend
npm run format
```

### Type Checking
```bash
cd backend
npm run build

cd frontend
npm run type-check
```

---

## Hot Reload

### Backend
```bash
# Automatic with npm run start:dev
```

### Frontend
```bash
# Automatic with npm run dev
```

---

## Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## Deployment Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Set `DB_HOST` to RDS endpoint
- [ ] Set `REDIS_HOST` to ElastiCache endpoint
- [ ] Enable HTTPS in nginx/load balancer
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Test disaster recovery

---

## Getting Help

- Check [README.md](./README.md) for architecture overview
- Check [API.md](./API.md) for API endpoints
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Check logs: `docker-compose logs -f`
- Create issue on GitHub with:
  - OS and Node version
  - Steps to reproduce
  - Full error message/logs
  - Screenshots if applicable
