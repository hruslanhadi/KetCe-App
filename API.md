# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except auth) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin User"
}

Response: 200
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "user"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response: 200
{
  "access_token": "eyJhbGci...",
  "user": { ... }
}
```

---

## Order Endpoints

### Create Order
```
POST /orders
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "+918123456789",
  "delivery_address": "123 Main St",
  "notes": "No spicy",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "packing": "Box",
      "information": "Extra rice"
    }
  ],
  "source": "web"
}

Response: 201
{
  "id": "uuid",
  "customer_name": "John Doe",
  "customer_phone": "+918123456789",
  "status": "pending",
  "delivery_status": "pending",
  "source": "web",
  "total_price": 1000.00,
  "delivery_address": "123 Main St",
  "notes": "No spicy",
  "items": [ ... ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Get All Orders
```
GET /orders?status=pending&source=web&limit=10&offset=0

Response: 200
{
  "data": [ { order objects } ],
  "total": 42
}
```

### Get Order by ID
```
GET /orders/:id

Response: 200
{ order object }
```

### Update Order Status
```
PUT /orders/:id/status
Content-Type: application/json

{
  "status": "confirmed|preparing|delivered|canceled"
}

Response: 200
{ updated order object }
```

### Get Order Statistics
```
GET /orders/stats

Response: 200
{
  "total_orders": 42,
  "total_revenue": 15000.50,
  "pending_orders": 5
}
```

### Get Customer Orders
```
GET /orders/customer/:phone

Response: 200
[ { array of orders } ]
```

---

## Product Endpoints

### Get All Products
```
GET /products

Response: 200
[
  {
    "id": "uuid",
    "name": "Nasi Kuning",
    "price": 150.00,
    "group_id": "uuid",
    "description": "Yellow rice with turmeric",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

### Get Product by Group
```
GET /products/group/:groupId

Response: 200
[ { array of products in group } ]
```

### Create Product
```
POST /products
Content-Type: application/json

{
  "name": "Nasi Kuning",
  "price": 150.00,
  "group_id": "uuid",
  "description": "Yellow rice with turmeric"
}

Response: 201
{ product object }
```

### Update Product
```
PUT /products/:id
Content-Type: application/json

{
  "name": "Nasi Kuning Premium",
  "price": 200.00
}

Response: 200
{ updated product object }
```

### Delete Product
```
DELETE /products/:id

Response: 200
{ success: true }
```

---

## Product Group Endpoints

### Get All Groups
```
GET /product-groups

Response: 200
[
  {
    "id": "uuid",
    "name": "Nasi Dishes",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

### Create Group
```
POST /product-groups
Content-Type: application/json

{
  "name": "Curry Dishes"
}

Response: 201
{ group object }
```

### Update Group
```
PUT /product-groups/:id
Content-Type: application/json

{
  "name": "Curry Dishes (Updated)"
}

Response: 200
{ updated group object }
```

### Delete Group
```
DELETE /product-groups/:id

Response: 200
{ success: true }
```

---

## WhatsApp Webhook

### Incoming Message
```
POST /whatsapp/webhook
Content-Type: application/json

{
  "from": "+918123456789",
  "body": "order Nasi Kuning 2"
}

Response: 200
{
  "message": "✅ Order confirmed!\nOrder ID: abc123\nTotal: ₹300\nYou will be notified when ready."
}
```

### Supported Commands
- `menu` - Display menu
- `order <product_name> <quantity>` - Create order
  - Example: `order Nasi Kuning 2`

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting
Not implemented in MVP. Consider adding for production.

## Pagination
Use `limit` and `offset` query parameters.
- `limit`: number of results (default: 10)
- `offset`: number of results to skip (default: 0)
