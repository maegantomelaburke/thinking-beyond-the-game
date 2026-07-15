# Think Beyond the Game

A single-page quiz that helps student athletes see career and identity lanes
beyond their sport. Six questions, six roles, top two results, saved for a
facilitator to review by name.

## File structure

```
public/index.html   the quiz
public/results.html  facilitator view (password protected, not linked from the quiz)
public/style.css     shared styles for both pages
public/quiz.js       quiz logic (questions, shuffling, scoring, submit)
public/results.js    facilitator page logic (password gate, table, summary)
server.js            Express server: static files + /api/submit + /api/results + /results
db.js                SQLite setup (better-sqlite3), creates the table on first run
package.json          start script + dependencies (express, better-sqlite3)
railway.json          explicit Nixpacks build/start config for Railway
```

## Environment variables

- `RESULTS_PASSWORD` — **required**. Shared password for `/results`. If it's
  not set, the results API refuses all requests (fails closed) instead of
  falling back to a default password.
- `PORT` — set automatically by Railway. Defaults to `3000` locally.
- `RAILWAY_VOLUME_MOUNT_PATH` — set automatically by Railway when a volume is
  attached to the service. `db.js` uses it to put the SQLite file on the
  persistent volume with no extra config. If unset (no volume attached), it
  falls back to a local `./data` folder.

There's an `.env.example` for reference — Railway variables are set in the
dashboard, not from a committed `.env` file.

## Deploying to Railway

1. Push this repo to GitHub and connect it as a new Railway service (or run
   `railway up` from this directory).
2. Railway's Nixpacks builder auto-detects Node from `package.json`, runs
   `npm install` (compiling `better-sqlite3`'s native module), and starts the
   app with `npm start`. Nothing extra to configure — `railway.json` just
   makes that explicit.
3. In the Railway dashboard, set the `RESULTS_PASSWORD` variable on the
   service. The app will boot without it, but `/results` will return an error
   until it's set.
4. **Attach a persistent volume** to the service (Railway dashboard →
   service → Volumes → New Volume) and mount it at, e.g., `/data`. This is
   the one manual step: Railway can't provision disk on its own. Once
   attached, Railway auto-injects `RAILWAY_VOLUME_MOUNT_PATH`, and `db.js`
   picks it up automatically — no code or config changes needed. Without a
   volume, the SQLite file lives on ephemeral disk and resets on every
   redeploy.
5. Deploy. The quiz is served at `/`, the facilitator view at `/results`.

## Data and privacy

No analytics or third-party scripts beyond Google Fonts. Student names and
results are only readable through the password-protected `/results` page,
which is not linked from the quiz itself.
