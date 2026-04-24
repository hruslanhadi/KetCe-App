# Quick Command Reference

## 🚀 Start Everything

```bash
cd /media/hanafiahrh/DataAll1/Project/KetCe-App
docker-compose up
```

**Access Points:**
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Database: localhost:5432
- Redis: localhost:6379

---

## 🛑 Stop Everything

```bash
docker-compose down
```

---

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

---

## 🗄️ Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U catering_user -d ketce_catering

# View tables
\dt

# View users
SELECT * FROM "user";

# View orders
SELECT * FROM "order";

# Exit
\q
```

---

## 💾 Redis Access

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check if running
PING

# View keys
KEYS *

# Exit
EXIT
```

---

## 🔧 Local Development

### Backend (Terminal 1)
```bash
cd backend
npm install
npm run start:dev

# Running on http://localhost:3000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev

# Running on http://localhost:3001
```

### Database (Terminal 3)
```bash
docker run -d \
  --name ketce_postgres \
  -e POSTGRES_USER=catering_user \
  -e POSTGRES_PASSWORD=catering_password \
  -e POSTGRES_DB=ketce_catering \
  -p 5432:5432 \
  postgres:16-alpine
```

### Redis (Terminal 4)
```bash
docker run -d \
  --name ketce_redis \
  -p 6379:6379 \
  redis:7-alpine
```

---

## 🧹 Clean & Reset

```bash
# Stop containers
docker-compose down

# Remove volumes (BE CAREFUL - deletes data)
docker-compose down -v

# Rebuild images
docker-compose build

# Fresh start
docker-compose up --build
```

---

## 📈 Check Health

```bash
# All services running?
docker-compose ps

# Service status
docker-compose ps backend
docker-compose ps frontend
docker-compose ps postgres
docker-compose ps redis
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

---

## 🔍 Code Quality

```bash
# Linting
cd backend
npm run lint

# Formatting
npm run format

# Type checking
npm run build
```

---

## 📝 API Testing

### Quick Test Order (curl)
```bash
# Create product group
curl -X POST http://localhost:3000/api/product-groups \
  -H "Content-Type: application/json" \
  -d '{"name":"Rice Dishes"}'

# Response: note the group_id

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Nasi Kuning",
    "price":150,
    "group_id":"GROUP_ID_HERE",
    "description":"Yellow Rice"
  }'

# Response: note the product_id

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name":"John Doe",
    "customer_phone":"+918123456789",
    "delivery_address":"123 Main St",
    "items":[
      {
        "product_id":"PRODUCT_ID_HERE",
        "quantity":2
      }
    ],
    "source":"web"
  }'
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Database Connection Refused
```bash
# Check if postgres is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Redis Connection Error
```bash
# Check if redis is running
docker-compose ps redis

# Restart
docker-compose restart redis

# Test connection
redis-cli -h localhost ping
```

### Clear Node Modules
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

# OR
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 WhatsApp Testing

### Simulate Webhook
```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "from":"+918123456789",
    "body":"menu"
  }'
```

---

## 🚀 Production Build

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

---

## 📚 Documentation

- **README.md**: Overview and features
- **SETUP.md**: Detailed setup guide
- **API.md**: All API endpoints
- **ARCHITECTURE.md**: Design decisions
- **ROADMAP.md**: Future features
- **COMPLETION_SUMMARY.md**: What's included

---

## 🎯 Common Tasks

### Add a New Product
```bash
# 1. Create group
curl -X POST http://localhost:3000/api/product-groups \
  -H "Content-Type: application/json" \
  -d '{"name":"New Category"}'

# 2. Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Product Name",
    "price":100,
    "group_id":"GROUP_ID",
    "description":"Description"
  }'

# 3. Check on dashboard
# Visit http://localhost:3001/dashboard
```

### View All Orders
```bash
curl http://localhost:3000/api/orders
```

### Get Order Statistics
```bash
curl http://localhost:3000/api/orders/stats
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```

---

## 💡 Tips

1. **Use docker-compose logs -f** for real-time debugging
2. **Check .env files** if services won't connect
3. **Use Postman** for API testing with saved requests
4. **Keep terminals organized** - one for logs, one for dev
5. **Restart services** if experiencing weird issues
6. **Always backup data** before `docker-compose down -v`

---

## 🆘 Need Help?

1. Check relevant markdown file (README, SETUP, API)
2. Review container logs: `docker-compose logs service_name`
3. Connect to database directly to inspect data
4. Check that all ports are available
5. Verify .env files are properly configured

Good luck! 🚀
