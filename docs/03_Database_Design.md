# Database Design

FinTrack uses MongoDB with Mongoose. Four core collections: Users, Categories, Transactions, Budgets.

---

## 1. User

Stores account and profile info.

- _id : ObjectId - Primary key
- name : String - Required
- email : String - Required, unique, lowercase
- password : String - Required, bcrypt-hashed, never returned in queries (select: false)
- profilePicture : String - URL, optional
- createdAt : Date - Auto (timestamps)
- updatedAt : Date - Auto (timestamps)

---

## 2. Category

Both default (system-wide) and user-created custom categories.

- _id : ObjectId - Primary key
- user : ObjectId - Ref: User. null for default/system categories
- name : String - Required, e.g. "Groceries", "Salary"
- type : String - Enum: income | expense
- isDefault : Boolean - true = seeded system category, false = user-created
- createdAt : Date - Auto

Note: Seed a fixed set of default categories (Food, Transport, Bills, Salary, Freelance, etc.) at first server start so new users have something to pick from immediately.

---

## 3. Transaction

The core record - every income or expense entry.

- _id : ObjectId - Primary key
- user : ObjectId - Ref: User, required
- category : ObjectId - Ref: Category, required
- type : String - Enum: income | expense, required
- amount : Number - Required, must be > 0
- date : Date - Transaction date (user-selectable, not just "now")
- note : String - Optional, free text
- createdAt : Date - Auto
- updatedAt : Date - Auto

Indexes: compound index on { user: 1, date: -1 } for fast history/filter queries, and { user: 1, category: 1 } for category breakdowns.

---

## 4. Budget

Monthly spending limits per category.

- _id : ObjectId - Primary key
- user : ObjectId - Ref: User, required
- category : ObjectId - Ref: Category, required
- month : String - Format "YYYY-MM", e.g. "2026-07"
- limitAmount : Number - Required, must be > 0
- createdAt : Date - Auto

Constraint: unique compound index on { user, category, month } - one budget per category per month.

Derived, not stored: "remaining budget" and "% used" are calculated at query time from the sum of matching Transactions, not stored as a field (avoids sync bugs).

---

## Relationships

- User (1) to Category (many) - user-created only; default categories have user: null
- User (1) to Transaction (many)
- User (1) to Budget (many)
- Category (1) to Transaction (many)
- Category (1) to Budget (many)

Every Transaction and Budget belongs to exactly one User and references exactly one Category. A Category can be reused across many Transactions and Budgets.