Spotify Integration Setup

Environment Variables

Create a `.env` in `backend/` with:

```
PORT=3001
SPOTIFY_CLIENT_ID="your_client_id"
SPOTIFY_CLIENT_SECRET="your_client_secret"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3001/api/spotify/callback"
SPOTIFY_SCOPE="user-read-playback-state user-modify-playback-state user-read-currently-playing"
SPOTIFY_SUCCESS_REDIRECT_URL="http://localhost:5173/#/spotify/success"
DATABASE_URL="postgresql://..."
```

Install deps

```
cd backend
npm install
```

Prisma

````
npx prisma migrate dev --name add_spotify_account
npx prisma generate
```
might need to do prisma reset if there's errors then run the above commands again
````
