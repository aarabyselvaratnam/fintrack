# Day 1

## Completed
- Created GitHub repository
- Planned project structure and designed folders
- Wrote database design doc (03_Database_Design.md) — defined User, Category, Transaction, and Budget collections with fields, relationships, and indexes
- Wrote API design doc (04_API_Design.md) — listed all REST endpoints for auth, users, categories, transactions, budgets, dashboard, and reports
- Built Mongoose models: User.js (with bcrypt password hashing), Category.js, Transaction.js, Budget.js
- Set up core backend files: server.js (entry point), app.js (Express app + middleware), config/db.js (MongoDB connection), middleware/errorHandler.js (global error handling), .env.example
- Installed backend dependencies: express, mongoose, bcrypt, jsonwebtoken, dotenv, cors, nodemon

## Challenges
- Understanding project organization
- Deciding how to store budget "remaining amount" — resolved by calculating it at query time from transactions instead of storing it, to avoid data going out of sync

## Learned
- Why scalable folder structures matter
- How Mongoose schema hooks (pre-save) work for automatically hashing passwords before saving a user
- Why indexes matter for query performance (e.g. compound index on user + date for transaction history)
- Separating app.js (Express config) from server.js (startup/DB connection) keeps the codebase easier to test later

## Next
- Build authentication: authController (register/login), authRoutes, and JWT middleware
- Test health check and auth endpoints in Postman



# Day 2

## Completed
- Built full JWT authentication flow: authController.js (register, login, getMe), authRoutes.js, authMiddleware.js (protect), generateToken.js
- Converted all backend files from CommonJS to ES Modules (import/export) to match the project's actual package.json config ("type": "module") — app.js, server.js, config/db.js, all four models, middleware, and auth files
- Fixed .env configuration: corrected MONGO_URI variable name (was mistakenly MONGODB_URI) and cleaned up JWT_SECRET value
- Fixed a Mongoose pre-save hook bug in User.js — removed manual next() calls from the async password-hashing hook, since newer Mongoose versions handle async middleware via promises, not callbacks
- Successfully tested full auth flow in Postman: register → login → GET /me with Bearer token, all returning correct responses

## Challenges
- Mixed module syntax (CommonJS require/module.exports vs ES Module import/export) caused a SyntaxError on startup — resolved by rewriting all backend files consistently in ESM to match package.json
- MongoDB connection failed silently with "uri must be a string, got undefined" — traced to a mismatched environment variable name in .env
- Cryptic "next is not a function" error from the register endpoint — traced to an outdated callback-style next() call inside an async Mongoose pre-save hook

## Learned
- Node determines module system (CommonJS vs ESM) from "type" in package.json — every file in the project must consistently follow the same style, including the .js extension being required on local imports in ESM
- Environment variable names must match exactly between .env and the code reading process.env — no room for typos like MONGODB_URI vs MONGO_URI
- In modern Mongoose, async pre-save hooks should not call next() manually — Mongoose waits on the returned promise instead, and calling next() throws since it's not passed as an argument
- How to debug an Express + Mongoose backend systematically: read the exact error message, isolate which layer it's coming from (syntax → module loading → env config → library-specific behavior), and fix one layer at a time

## Next
- Build category routes/controller (CRUD for categories)
- Build transaction routes/controller (CRUD + filtering)
- Continue testing each new resource in Postman before moving to the next