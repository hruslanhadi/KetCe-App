# Migration Guide

## TypeORM Migrations (Future)

Once the MVP is stable, set up proper migrations:

### Generate Migration
```bash
npm run migration:generate -- src/migrations/CreateOrdersTable
```

### Run Migrations
```bash
npm run migration:run
```

### Revert Migration
```bash
npm run migration:revert
```

### Show Migrations
```bash
npm run migration:show
```

## Current Setup

For MVP, we use `synchronize: true` in TypeORM config which:
- Automatically creates/updates tables from entities
- **IMPORTANT**: Only use in development!
- In production, replace with explicit migrations

## Data Seeding (Future)

Create seed file: `src/seeds/seed.ts`

```typescript
import { getRepository } from 'typeorm';
import { ProductGroup } from '@/common/database/entities';

export async function seed() {
  const groupRepository = getRepository(ProductGroup);
  
  const groups = [
    { name: 'Rice Dishes' },
    { name: 'Curry' },
    { name: 'Bread' },
  ];
  
  for (const group of groups) {
    await groupRepository.save(group);
  }
}
```

Run from main.ts or separate script.
