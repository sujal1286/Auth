# Auth Project

Local setup and testing instructions for the Backend and Frontend.

## Prerequisites
- Node.js (16+ recommended)
- npm
- MongoDB instance (local or remote)

## Environment

Backend requires a `.env` file in `Backend/` with the following variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for signing JWT tokens
- `SMTP_USER` - (optional) SMTP username for sending mail
- `SMTP_PASS` - (optional) SMTP password
- `SENDER_EMAIL` - (optional) Email address shown as sender

Frontend uses Vite environment variables. Create `.env` in `Frontend/` with:

- `VITE_BACKEND_URL` - e.g. `http://localhost:5000`

## Run Backend

Open a terminal in `Backend/` and run:

```
npm install
node index.js
```

This starts the backend on port 5000 by default. The app logs OTP values to the server console for development/testing (useful when SMTP isn't configured).

## Run Frontend

Open a terminal in `Frontend/` and run:

```
npm install
npm run dev
```

Vite will start (default port 5173). If the port is in use it will try a different port (e.g. 5174).

## Testing the OTP-based registration flow

1. Register a new user via the frontend or by POSTing to `/api/auth/register` with JSON body `{ name, email, password }`.
2. Check the Backend server console — the generated OTP will be printed in development logs.
3. Use the frontend Verify page or POST to `/api/auth/verify-account` with `{ userId, otp }` to verify the account.
4. Login at `/api/auth/login` (credentials) — a JWT cookie will be set and the protected endpoint `/api/user/data` can be fetched by the frontend to show user data.

## Notes
- The app stores JWT token in an HTTP-only cookie for authentication; the frontend sends requests with credentials enabled.
- For production email delivery, configure SMTP credentials in the Backend `.env`.
