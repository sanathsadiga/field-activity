# field-activity (MERN Auth Starter)

Lightweight MERN starter focused on authentication (signup/login/me) with a small admin example. This repo contains a React + Vite client and an Express + Mongoose server.

## Quick overview

- Client: React (Vite)
- Server: Node + Express (ES modules) with MongoDB (Mongoose)
- Auth: JWT-based authentication with a `User` model and role-based guard for admin-only routes

## Folder structure

```
client/
  src/
    api.js            # axios wrapper used by the UI
    components/       # Navbar, ProtectedRoute, pages
    context/          # AuthContext (AuthProvider + useAuth hook)
    pages/            # Login, Signup, UserHome, AdminDashboard
  package.json

server/
  src/
    server.js         # app entry
    config/db.js      # mongoose connection
    middleware/auth.js# auth middleware + requireRole
    models/User.js    # User schema
    routes/
      auth.js         # signup, login, me
      user.js         # protected example routes
    seed/adminSeed.js  # optional script to create an admin user
  package.json

```

## Prerequisites

- Node.js (v18+ recommended; tested with Node v24)
- npm
- A running MongoDB instance (local or hosted)
- Git for cloning/pushing

## Environment variables

Create a `.env` file in the `server/` folder (same directory as `package.json`). Example:

```
MONGO_URI=mongodb://localhost:27017/field-activity
JWT_SECRET=some-long-random-secret
CLIENT_ORIGIN=http://localhost:5173   # your client origin for CORS (Vite default)
PORT=5002
```

Client (optional) - create `.env` at project root of `client/` (Vite expects `VITE_` prefix):

```
VITE_API_BASE_URL=http://localhost:5002/api
```

Notes:
- The client `src/api.js` falls back to `http://localhost:5001/api` if `VITE_API_BASE_URL` is not provided. To avoid mismatch, set `VITE_API_BASE_URL` to your server URL (example above uses port `5002`).

## Install & run (local development)

1. Install server dependencies and start server

```bash
cd server
npm install
# Start in dev mode (nodemon)
npm run dev
```

2. Install client dependencies and start client

```bash
cd ../client
npm install
# Start Vite dev server (default port 5173)
npm run dev
```

Open the client (usually at `http://localhost:5173`) and use the UI. The client talks to the API base URL set by `VITE_API_BASE_URL`.

## API routes (current)

Base path: `/api`

- POST `/api/auth/signup` — register a new user
  - Body: { name, email, password }
  - Returns: { user, token }

- POST `/api/auth/login` — login
  - Body: { email, password }
  - Returns: { user, token }

- GET `/api/auth/me` — get current user
  - Needs `Authorization: Bearer <token>` header
  - Returns: { user }

- GET `/api/profile` — protected user route
  - Needs JWT

- GET `/api/admin/analytics` — admin-only example
  - Needs JWT and role `admin`

## Seeding an admin user

After configuring `.env` (esp. `MONGO_URI` and `JWT_SECRET`) you can run the admin seed script to create a sample admin user:

```bash
cd server
npm run seed:admin
```

Check `server/src/seed/adminSeed.js` to edit seed credentials.

## Notes & troubleshooting

- If you see an error about `import`/`export` ("Cannot use import statement outside a module"), ensure `server/package.json` contains:

```json
  "type": "module"
```

- If you change server port, update `VITE_API_BASE_URL` in the client `.env` accordingly.

- Nodemon is configured to run `src/server.js` in dev. It will automatically restart on file changes.

## Tests and linting

- Client has `npm run lint` (ESLint) configured. Run from `client/`.

## Contributing / Collaborators

- Please create feature branches and open PRs. Keep changes limited and add tests where appropriate.

## Push this repo to GitHub

If you want to push this repository to `https://github.com/sanathsadiga/field-activity.git`, run the following from the repository root (only if you haven't already set a remote):

```bash
git remote add origin https://github.com/sanathsadiga/field-activity.git
git branch -M main
git add .
git commit -m "chore: add README"
git push -u origin main
```

If you already have the remote configured, just `git add`, `git commit` and `git push` as usual.

## License

MIT (adjust as you prefer)

---

If you'd like, I can also:
- Split the `AuthContext` hook into a dedicated file (cleans up ESLint rule exemptions),
- Add a small healthcheck endpoint, or
- Add a short Postman collection / cURL examples for the routes.

Happy hacking!
