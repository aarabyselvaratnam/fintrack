# API Design

Base URL: /api
Auth: JWT sent as "Authorization: Bearer <token>" header, required on all routes except register/login.
All list endpoints return paginated JSON: { data: [...], page, totalPages, totalItems }

---

## Auth

- POST /auth/register - Body: { name, email, password } - Create account, returns JWT
- POST /auth/login - Body: { email, password } - Returns JWT + user info
- POST /auth/logout - Body: none - Client discards token (stateless)
- GET /auth/me - Body: none - Returns current logged-in user

---

## Users

- GET /users/profile - Body: none - Get own profile
- PUT /users/profile - Body: { name, profilePicture } - Update profile info
- PUT /users/change-password - Body: { oldPassword, newPassword } - Change password

---

## Categories

- GET /categories - Body: none - List default + user's own categories
- POST /categories - Body: { name, type } - Create custom category
- PUT /categories/:id - Body: { name } - Edit own custom category (not defaults)
- DELETE /categories/:id - Body: none - Delete own custom category

---

## Transactions

- GET /transactions - Query: type, category, startDate, endDate, search, sort, page, limit - List/filter/search transactions
- GET /transactions/:id - Body: none - Get one transaction
- POST /transactions - Body: { type, amount, category, date, note } - Create transaction
- PUT /transactions/:id - Body: { type, amount, category, date, note } - Edit transaction
- DELETE /transactions/:id - Body: none - Delete transaction

---

## Budgets

- GET /budgets - Query: month - List budgets for a given month
- POST /budgets - Body: { category, month, limitAmount } - Create budget
- PUT /budgets/:id - Body: { limitAmount } - Update budget limit
- DELETE /budgets/:id - Body: none - Delete budget
- GET /budgets/progress - Query: month - Budgets with spent amount + % used

---

## Dashboard

- GET /dashboard/summary - Returns { balance, totalIncome, totalExpense } for a period
- GET /dashboard/recent-transactions - Last N transactions (default 5)

---

## Reports

- GET /reports/monthly - Query: year, month - Income vs expense totals for the month
- GET /reports/yearly - Query: year - Month-by-month totals for the year
- GET /reports/category-breakdown - Query: startDate, endDate - Spend grouped by category (for pie chart)

---

## Standard response shapes

Success:
{ "success": true, "data": { ... } }

Error:
{ "success": false, "message": "Category not found" }

## Status codes

200 OK, 201 Created, 204 No Content (delete)
400 validation error, 401 no/invalid token, 403 forbidden (e.g. editing another user's data or a default category), 404 not found, 409 conflict (e.g. duplicate budget for same category+month), 500 server error