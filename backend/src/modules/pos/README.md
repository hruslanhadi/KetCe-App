# POS Module

This module is reserved for Point of Sale integration in Phase 2.

## Planned Features
- POS system integration
- In-store order creation
- Cash/Card payments
- Receipt printing
- Sync with web orders

## Integration Points
- Orders (create from POS)
- Products (inventory management)
- Payments (transaction logging)

## Implementation Notes
- Will share OrderService.createOrder() with source="pos"
- Can integrate with popular POS systems (Square, Toast, etc.)
