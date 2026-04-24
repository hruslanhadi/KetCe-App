# Architecture Decision Records

## ADR-001: Modular Monolith Instead of Microservices

### Decision
Use a modular monolith architecture instead of microservices.

### Rationale
- **Faster MVP delivery**: Single codebase, single deployment
- **Simpler debugging**: Easier to trace calls and debug issues
- **Better for MVP**: Most catering apps don't need distributed systems
- **Future scalability**: Easy to extract modules to microservices later

### Consequences
- Single point of deployment (acceptable for MVP)
- Shared database (fine for MVP, can shard later)
- Clear module boundaries make future extraction easy

---

## ADR-002: Multi-Channel Order Entry Through Single Service

### Decision
All orders (WhatsApp, Web, POS) must go through `OrderService.createOrder(dto, source)`.

### Rationale
- **Consistency**: All orders follow the same business rules
- **Maintainability**: Single place to change order logic
- **Extensibility**: Easy to add new channels
- **Testability**: Can test order logic independently of channels

### Implementation
```typescript
// All channels call this
await orderService.createOrder(data, source: "whatsapp"|"web"|"pos")
```

---

## ADR-003: WhatsApp as Adapter Pattern

### Decision
WhatsApp module acts ONLY as an adapter, not accessing database directly.

### Rationale
- **Separation of concerns**: Messaging ≠ Business logic
- **Easy to replace**: Can swap WhatsApp impl without touching orders
- **Cleaner code**: WhatsApp service only handles parsing/formatting
- **Future flexibility**: Can use different WhatsApp providers

### Pattern
```
WhatsApp Message 
  ↓
WhatsApp Service (Parse, Validate)
  ↓
OrderService (Business Logic)
  ↓
Database
```

---

## ADR-004: Event-Driven for Notifications

### Decision
Use internal event bus + BullMQ for async notifications.

### Rationale
- **Scalability**: Notifications don't block order creation
- **Reliability**: Failed notifications can be retried
- **Loose coupling**: Notification logic separate from orders
- **Future ready**: Can easily add more listeners

---

## ADR-005: UUID for All Primary Keys

### Decision
Use UUID for all entity primary keys instead of auto-increment integers.

### Rationale
- **Distributed friendly**: Can generate IDs without database
- **Privacy**: Order IDs don't reveal sequence/volume
- **Security**: Harder to enumerate/attack
- **Better for replication**: No ID collision issues

---

## ADR-006: Snapshots in Order Entity

### Decision
Store `customer_name` and `customer_phone` as snapshots in Order, not just FK.

### Rationale
- **Order history**: If customer name changes, old order still has correct name
- **Reporting**: Easier to generate reports without customer joins
- **Data integrity**: Order data is self-contained
- **Query performance**: No need to join with customers for order display

---

## ADR-007: Repository Pattern for Data Access

### Decision
Use Repository pattern for data access (service calls repository).

### Rationale
- **Testability**: Easy to mock repositories in unit tests
- **Flexibility**: Can switch ORM/database later
- **Consistency**: Centralized query logic
- **Clean architecture**: Service doesn't know about ORM details
