# FormBoost (Next.js MERN Version)

FormBoost is a MERN demo app that lets users submit a Google Form response delivery request through a clean two-step flow (**request → payment**) while an admin dashboard reviews and updates order status.

The backend stores orders in MongoDB and can optionally send email notifications using Gmail + Nodemailer.

## Contents

- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Frontend routes](#frontend-routes)
- [Backend API](#backend-api)
- [Environment variables](#environment-variables)
- [Run locally](#run-locally)
- [Usage walkthrough](#usage-walkthrough)
- [Architecture](#architecture)
- [Notes / limitations](#notes--limitations)

## Project structure

```text
learning-4/
  backend/
    server.js
    routes/
      orderRoutes.js
      adminRoutes.js
    models/
      Order.js
    middleware/
      authMiddleware.js
    utils/
      emailService.js
    config/
      db.js
    package.json
    package-lock.json
    .env

  frontend/   (Next.js app)
    pages/
      index.js
      request.js
      payment.js
      admin/
        login.js
        index.js

    components/
      Layout.js
      Navbar.js

    styles/
      globals.css
      pages.css

    next.config.js
    package.json
    package-lock.json
    .env.local
```

## Tech stack

### Backend (`learning-4/backend`)

- Node.js + Express
- MongoDB + Mongoose
- Auth: JWT (admin only)
- Security:
  - helmet
  - cors
  - express-mongo-sanitize
  - express-rate-limit
- Email: Nodemailer (Gmail)
- Env: dotenv

### Frontend (`learning-4/frontend`)

- Next.js (JavaScript)
- Routing: file-based routing
- State management: React hooks
- Notifications: react-hot-toast
- Styling: CSS modules / global CSS

## Features

- Landing page with pricing plans
- Order request form
- Order creation stored in MongoDB
- Payment step (development mock)
- Optional email notifications:
  - order received
  - status updates
  - payment confirmation
- Admin authentication:
  - JWT based login
  - rate-limited login attempts
- Admin dashboard:
  - view all orders
  - approve / reject orders
  - update order status

## Frontend routes

Next.js uses file-based routing, so routes are mapped automatically from the `pages` folder.

| Route | File |
|---|---|
| `/` | `pages/index.js` |
| `/request` | `pages/request.js` |
| `/payment` | `pages/payment.js` |
| `/admin/login` | `pages/admin/login.js` |
| `/admin` | `pages/admin/index.js` |

Example page:

```js
// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>FormBoost</h1>
      <p>Google Form response delivery service</p>
    </div>
  )
}
```

## Backend API

Backend server:

- `backend/server.js`
- Runs on `http://localhost:5000`
- Base paths:
  - `/api`
  - `/api/admin`

### Orders API

#### Create order

- **POST** `/api/orders`
- Creates a new order.
- Returns: `201 Created`

#### Get all orders (admin)

- **GET** `/api/orders`
- Requires: `Authorization: Bearer <token>`
- Returns all orders sorted by newest.

#### Get single order

- **GET** `/api/orders/:id`
- Returns order by MongoDB `_id`.

#### Update order status (admin)

- **PUT** `/api/orders/:id/status`
- Body:

```json
{
  "status": "Approved | Rejected | Confirmed | Pending"
}
```

Updates order status and sends optional email notification.

#### Verify payment (mock)

- **POST** `/api/verify-payment`
- Body example:

```json
{
  "order_id": "mongo_id"
}
```

Updates:

- `paymentStatus = Paid`
- `status = Confirmed`

Response:

```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Admin API

#### Admin login

- **POST** `/api/admin/login`
- Rate limited: **5 requests / 15 minutes per IP**
- Body:

```json
{
  "username": "...",
  "password": "..."
}
```

Returns:

```json
{
  "token": "...",
  "message": "..."
}
```

JWT is signed using `JWT_SECRET`.

## Environment variables

### Backend `.env`

File: `backend/.env`

```env
MONGO_URL=mongodb://localhost:27017/formboost
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=change_me

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend `.env.local`

File: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

This allows the frontend to call the backend API.

Example request:

```js
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`)
```

## Run locally

### 1) Clone and install dependencies

```bash
# backend
cd learning-4/backend
npm install

# frontend
cd ../frontend
npm install
```

### 2) Configure environment

- Create `learning-4/backend/.env` from the example above.
- Create `learning-4/frontend/.env.local` from the example above.

### 3) Start services

```bash
# terminal 1 (backend)
cd learning-4/backend
npm run dev

# terminal 2 (frontend)
cd learning-4/frontend
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Usage walkthrough

1. Open `/` and choose a plan.
2. Go to `/request` and submit the order form.
3. Proceed to `/payment` and complete mock verification.
4. Admin logs in at `/admin/login`.
5. Admin reviews and updates order status in `/admin`.

## Architecture

- **Frontend (Next.js)**: captures user input and drives request/payment flow.
- **Backend (Express API)**: validates requests, stores/retrieves orders, applies admin auth.
- **Database (MongoDB)**: stores order lifecycle (pending → approved/rejected/confirmed).
- **Email service (Nodemailer)**: sends optional transactional notifications.

## Notes / limitations

- Payment verification is a development mock endpoint.
- Gmail requires an app password when 2FA is enabled.
- Admin credentials are env-based for demo use.
- Add production hardening (monitoring, audit logs, stronger RBAC) before deployment.
