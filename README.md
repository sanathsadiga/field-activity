# field-activity

Lightweight MERN focused on authentication (signup/login/me) with a small admin example. This repo contains a React + Vite client and an Express + Mongoose server.

## Quick overview

- Client: React (Vite)
- Server: Node + Express (ES modules) with MongoDB (Mongoose)
- Auth: JWT-based authentication with a `User` model and role-based guard for admin-only routes

## Folder structure

````
client/
  # field-activity (MERN Auth Starter)

  This repository is a lightweight MERN starter focused on authentication and a small field-activity data-collection feature set. It includes a React + Vite client and an Express + Mongoose server. The purpose of this README is to summarize recent features, explain how form data is stored, and give clear, step-by-step instructions for wiring an admin module so a new collaborator can add filters and centralized views quickly.

  ## Quick overview

  - Client: React (Vite)
  - Server: Node + Express (ES modules) with MongoDB (Mongoose)
  - Auth: JWT-based authentication with a `User` model and role-based guard for admin-only routes

  ## New features & UI options added

  The client now includes a multi-form `UserHome` UI where users can submit several kinds of field entries. The supported entry kinds are:

  - Stall — visit to a stall; auto-detects location (falls back to manual), select stall, record multiple paper types with supply/retail/net calculations.
  - Dealer — freeform dealer visit with `dealerName` and a multiline `discussion` field.
  - Depo — depot visit with only `Time visited` and `Time left` inputs (users enter time only; system composes today’s date with the entered times for storage).
  - Vendor — vendor visit; auto-detects location, select paper types with `supply` values only.
  - OH Visit — visit to an institution; collects `visitName`, `type` (hotel/education/govt/other) and a multiline `remark`.
  - Reader — collects `name`, `mobile` (digits-only, 10 chars), `address`, `occupation`, `sex`, and `feedback`.

  Each form submits to the same backend endpoint and the app provides simple client-side validation where applicable (e.g. mobile number digits-only, time fields required for Depo when submitting).

  ## Server changes (what was added)

  The server now includes a flexible `Entry` model and routes to create and list entries. Key additions:

  - `server/src/models/Entry.js` — `Entry` mongoose model. Key fields include:
    - `kind` (string) — the form type (stall, dealer, depo, vendor, oh, reader)
    - `user` (ObjectId, ref `User`) — who submitted the entry
    - `location` (string)
    - `coords` (object) — { latitude, longitude }
    - `stall` (string)
    - `papers` (array) — array of paper objects for stall/vendor entries
    - `data` (Mixed) — flexible place to store other form-specific fields (dealerName, discussion, depo times, reader fields, etc.)
    - timestamps (`createdAt`, `updatedAt`)

  - `server/src/routes/entries.js` — routes for entries:
    - POST `/api/entries` — create an entry (requires auth). The handler persists known top-level fields and will collect any additional top-level fields into `entry.data` when `payload.data` is not provided by the client. This keeps the model flexible while ensuring core fields remain queryable.
    - GET `/api/entries` — list entries with basic filters and pagination. Supported query params include `kind`, `location`, `page`, `limit`. Admin users can also filter by user via `?user=<userId>` and receive populated user info (name, email, role) in the response.
    - GET `/api/entries/stats` — admin-only aggregated statistics (grouped by `kind` and/or `location`).

  Auth and authorization middleware (`server/src/middleware/auth.js`) is used to protect these routes; some routes are admin-only.

  ## How form data is stored (per kind)

  All forms POST to `/api/entries` with a `kind` field included. The server stores data in a flexible `Entry` document. The conventions used by the current client are:

  - Stall
    - Stored fields: `kind: 'stall'`, `location`, `coords`, `stall`, `papers`.
    - `papers` is an array of objects: { type: 'VK'|'VV'|'PV'|'UV', supply: Number, retail: Number, net: Number }
    - Example (in stored document):
      - `papers: [{ type: 'VK', supply: 100, retail: 10, net: 90 }, ...]`


field-activity — short guide for a new collaborator

Read this to learn what the project does, how to run it, what is already implemented, and how to add an Admin module. Keep this open while you work.

1) What this project is (one sentence)

- A small MERN app: React client + Express server + MongoDB. Users submit field forms. Admins analyze submissions.

2) Quick start (3 commands)

Start the server:
```bash
cd server
npm install
npm run dev
````

Start the client:

```bash
cd client
npm install
npm run dev
```

Create `server/.env` (example):

```
MONGO_URI=mongodb://localhost:27017/field-activity
JWT_SECRET=change-me
CLIENT_ORIGIN=http://localhost:5173
PORT=5002
```

Create `client/.env`:

```
VITE_API_BASE_URL=http://localhost:5002/api
```

Open the client in the browser (usually http://localhost:5173).

## 3) Project layout (short map)

- client/

  - `src/api.js` — HTTP helpers (axios)
  - `src/context/AuthContext.jsx` — AuthProvider + useAuth hook
  - `src/pages/UserHome.jsx` — user forms: Stall, Dealer, Depo, Vendor, OH, Reader
  - `src/pages/AdminDashboard.jsx` — admin home (UI shell ready)

- server/
  - `src/server.js` — app entry
  - `src/config/db.js` — connects to MongoDB
  - `src/middleware/auth.js` — verifies JWT, adds req.user
  - `src/models/User.js` — user schema (name, email, passwordHash, role)
  - `src/models/Entry.js` — flexible entry model (see below)
  - `src/routes/auth.js` — signup/login/me
  - `src/routes/entries.js` — POST /api/entries and GET /api/entries and stats

Open these files to read handlers. They are short and self-explanatory.

## 4) Models: what is implemented now

- User: implemented. Contains name, email, passwordHash, role ('admin' or 'user').
- Entry: implemented. Key fields:
  - `kind` — one of stall/dealer/depo/vendor/oh/reader
  - `user` — ObjectId (ref User)
  - `location`, `coords`, `stall`, `papers` (when applicable)
  - `data` — a flexible container where extra form fields are preserved
  - timestamps (createdAt/updatedAt)

What is NOT yet normalized and is recommended:

- Depo `timeVisited`/`timeLeft` are stored as strings from the client. For date-range filters, convert them to typed `Date` fields server-side.

## 5) How each form maps to stored data (short table)

- Stall → top-level fields
  - location, coords, stall, papers[] (each paper: {type, supply, retail, net})
- Dealer → `data.dealerName`, `data.discussion`
- Depo → `data.timeVisitedLocal`, `data.timeLeftLocal` (client currently sends readable strings). Recommended: also store as `timeVisited: Date`, `timeLeft: Date` on server.
- Vendor → location, coords, papers[] (supply only)
- OH Visit → `data.visitName`, `data.type`, `data.remark`
- Reader → `data.name`, `data.mobile`, `data.address`, `data.occupation`, `data.sex`, `data.feedback`

Design principle used: server preserves any unknown top-level fields inside `data`. This avoids losing form-specific fields. But for querying and performance, important fields should be normalized to top-level typed fields.

## 6) Build the Admin module — step-by-step (teacher style)

Goal: let admins filter and inspect entries by kind, location, user and date/time ranges.

Step A — Admin basics

1. Ensure an admin user exists. Run the seed script or create a user and set their role to `admin` in the DB.
2. Login via `/api/auth/login`. Store token in localStorage. The Admin UI must send `Authorization: Bearer <token>`.

Step B — Small server changes (2 edits, safe)

1. Add Date fields to `Entry` schema:
   - `timeVisited: Date`
   - `timeLeft: Date`
2. In `server/src/routes/entries.js` POST handler, when `kind === 'depo'`, parse the client string times into Date objects (use `dayjs` or `luxon`) and set `entry.timeVisited` and `entry.timeLeft`.
3. In GET `/api/entries` support query params: `timeVisitedFrom`, `timeVisitedTo` and apply `$gte/$lte` on `timeVisited`.

Why: typed Date fields make range queries fast and reliable.

Step C — Admin frontend (UI wiring)

1. Add filter controls to `AdminDashboard.jsx` (or a new component):
   - Kind dropdown
   - Location dropdown
   - Date range picker (maps to `timeVisitedFrom` / `timeVisitedTo`)
   - User search box (admin-only)
   - Page size selector
2. On filter change build query string and call `GET /api/entries`.
3. Display results in a table with these columns: SubmittedBy, Kind, Location, SubmittedAt, Extra (depending on kind). Add a column for actions (view JSON / export row).
4. Add pagination UI using `page` and `limit` returned by server.

Step D — Aggregation and extra helpers

1. Use `GET /api/entries/stats` to populate dashboard charts (counts by kind, totals by location).
2. Implement CSV export: backend route that accepts the same filters and returns CSV.

Implementation tips (frontend)

- Use `URLSearchParams` to build queries.
- Include the token header for admin calls.
- Show a loader while the query runs.

Minimal fetch example:

```js
const q = new URLSearchParams({ kind, location, page, limit }).toString();
const res = await fetch(`${API_BASE}/entries?${q}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const json = await res.json();
```

## 7) Quick runnable checklist

1. Run server and client locally.
2. Inspect `client/src/pages/AdminDashboard.jsx` — it's the place to add filters and the table.
3. Edit `server/src/models/Entry.js` to add `timeVisited` and `timeLeft` as `Date` fields.
4. Edit `server/src/routes/entries.js` to parse depo times and to accept `timeVisitedFrom/timeVisitedTo` filters.
5. Implement the filter bar and wire `GET /api/entries` in the admin UI. Test with seed admin user.

## 8) Tools and libraries to use

- Use `dayjs` or `luxon` on the server to parse custom date strings.
- Use `react-table` or plain HTML table for quick admin table.
- Consider `papaparse` on the server for CSV export.

## 9) Final tips

- Normalize frequently queried fields into top-level typed fields.
- Add simple indexes on fields you will query often (kind, location, timeVisited).
- Add small server-side validation per `kind` to avoid bad data.

---
