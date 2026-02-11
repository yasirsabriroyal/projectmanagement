# ConstructFlow Database Schema

## Entity Relationship Diagram

```
┌─────────────────┐
│    Tenants      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ created_at      │
│ settings        │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────▼────────────┐
    │     Users       │
    ├─────────────────┤
    │ id (PK)         │
    │ tenant_id (FK)  │
    │ email           │
    │ name            │
    │ role            │
    │ created_at      │
    └─────────────────┘
         │
         │ 1:N
         │
┌────────▼────────────┐          ┌──────────────────┐
│     Projects        │          │    Invoices      │
├─────────────────────┤          ├──────────────────┤
│ id (PK)             │◄─────────│ id (PK)          │
│ tenant_id (FK)      │   1:N    │ tenant_id (FK)   │
│ name                │          │ project_id (FK)  │
│ status              │          │ invoice_number   │
│ start_date          │          │ amount           │
│ end_date            │          │ status           │
│ created_at          │          │ created_at       │
└────────┬────────────┘          └────────┬─────────┘
         │                                │
         │ 1:N                            │ 1:N
         │                                │
    ┌────▼────────────┐          ┌────────▼─────────┐
    │     Tasks       │          │    Payments      │
    ├─────────────────┤          ├──────────────────┤
    │ id (PK)         │          │ id (PK)          │
    │ project_id (FK) │          │ invoice_id (FK)  │
    │ name            │          │ amount           │
    │ status          │          │ payment_date     │
    │ assigned_to(FK) │          │ method           │
    │ progress_pct    │          │ created_at       │
    │ created_at      │          └──────────────────┘
    │ updated_at      │
    └─────────────────┘

┌─────────────────────────────┐
│      Audit_Logs             │
├─────────────────────────────┤
│ id (PK)                     │
│ tenant_id (FK)              │
│ user_id (FK)                │
│ entity_type                 │
│ entity_id                   │
│ action                      │
│ old_state                   │
│ new_state                   │
│ timestamp                   │
└─────────────────────────────┘
```

## Key Design Principles

1. **Multi-Tenancy**: All core tables include `tenant_id` for data isolation
2. **Financial Integrity**: Invoices and payments with audit trail
3. **Monotonic State Machines**: Tasks and projects use defined state transitions
4. **Audit Trail**: All state changes logged in audit_logs table

## Indexes

- `tenant_id` on all multi-tenant tables
- `status` on projects, tasks, invoices
- `created_at` on all tables for time-based queries
- Composite indexes on frequently joined columns
