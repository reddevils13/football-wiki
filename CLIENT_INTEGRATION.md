# Football Wiki API Client Integration

## ✅ What's Been Created

A fully-featured TypeScript API client has been integrated into your Football Wiki backend project!

### 📁 New Files Created

```
src/client/
├── ApiClient.ts              # Base HTTP client with error handling
├── FootballWikiClient.ts     # Main API client with all endpoints
├── example.ts                # Working example/demo script
└── index.ts                  # Export file
```

### 📚 Documentation Created

- **`CLIENT_USAGE.md`** - Complete guide on how to use the client

## 🎯 Features

### ✅ Complete REST API Coverage

The client now provides methods for ALL operations:

**Players:**
- `getAllPlayers()` → GET /players
- `getPlayerById(id)` → GET /players/:id
- `createPlayer(data)` → POST /players
- `updatePlayer(id, data)` → PUT /players/:id
- `deletePlayer(id)` → DELETE /players/:id

**Teams:**
- `getAllTeams()` → GET /teams
- `getTeamById(id)` → GET /teams/:id
- `createTeam(data)` → POST /teams
- `updateTeam(id, data)` → PUT /teams/:id
- `deleteTeam(id)` → DELETE /teams/:id

**Leagues:**
- `getAllLeagues()` → GET /leagues
- `getLeagueById(id)` → GET /leagues/:id
- `createLeague(data)` → POST /leagues
- `updateLeague(id, data)` → PUT /leagues/:id
- `deleteLeague(id)` → DELETE /leagues/:id

**Games:**
- `getAllGames()` → GET /games
- `getGameById(id)` → GET /games/:id
- `createGame(data)` → POST /games
- `updateGame(id, data)` → PUT /games/:id
- `deleteGame(id)` → DELETE /games/:id

**Player Careers:**
- `getAllPlayerCareers()` → GET /player-careers
- `getPlayerCareerById(id)` → GET /player-careers/:id
- `createPlayerCareer(data)` → POST /player-careers
- `updatePlayerCareer(id, data)` → PUT /player-careers/:id
- `deletePlayerCareer(id)` → DELETE /player-careers/:id

**Health & Info:**
- `hello()` → GET /hello
- `health()` → GET /health

## 🚀 How to Use

### 1. Basic Usage

```typescript
import { FootballWikiClient } from './client';

// Initialize
const client = new FootballWikiClient('http://localhost:3000');

// Use it!
const players = await client.getAllPlayers();
console.log(players);
```

### 2. Create Data Example

```typescript
import { FootballWikiClient } from './client';
import { PlayerLevel } from './models';

const client = new FootballWikiClient();

// Create a player
const player = await client.createPlayer({
  playerName: 'Lionel Messi',
  level: PlayerLevel.HARD
});

// Create a team
const team = await client.createTeam({
  teamName: 'FC Barcelona'
});
```

### 3. Run the Example Script

```bash
# Make sure your server is running first
npm run dev

# In another terminal, run the example
npm run client:example
```

## 🛠️ Backend Updates

### New API Endpoints Added

All CRUD operations are now fully implemented:

- ✅ GET endpoints for individual resources (/:id)
- ✅ PUT endpoints for updates
- ✅ DELETE endpoints for deletions
- ✅ Proper 204 status for successful deletions
- ✅ 404 status for not found resources

### Updated Routes

**Before:** Only GET (list) and POST (create) were available

**After:** Full CRUD support:
- GET /resource (list all)
- GET /resource/:id (get one)
- POST /resource (create)
- PUT /resource/:id (update)
- DELETE /resource/:id (delete)

## 📦 Dependencies Added

- ✅ **axios** - HTTP client for making requests
- ✅ **ts-node** - For running the example script

## 🎨 Key Features

### 1. Type Safety
```typescript
// TypeScript ensures correct types
const player: Player = await client.getPlayerById('uuid');
```

### 2. Error Handling
```typescript
try {
  await client.getPlayerById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.statusCode); // 404
    console.log(error.message);    // "Player not found"
  }
}
```

### 3. Lodash Integration
```typescript
// Safe property access in error handling
const message = get(error, 'response.data.error', 'Unknown error');
```

### 4. Interceptors
- Automatic error transformation
- Consistent error format
- Status code extraction

## 📖 Documentation

### CLIENT_USAGE.md
Complete documentation with:
- Installation instructions
- API reference for all methods
- Usage examples for every endpoint
- Error handling guide
- Complete working examples

## 🧪 Testing the Client

### Option 1: Run the Example Script

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Run the example
npm run client:example
```

### Option 2: Use in Your Own Code

```typescript
import { FootballWikiClient } from './client';
import { PlayerLevel } from './models';

async function myFunction() {
  const client = new FootballWikiClient();
  
  const player = await client.createPlayer({
    playerName: 'Cristiano Ronaldo',
    level: PlayerLevel.HARD
  });
  
  console.log('Created:', player);
}

myFunction();
```

## 🎯 Use Cases

### 1. Internal Testing
Use the client to test your API endpoints without curl or Postman

### 2. Frontend Integration
Import the client in a React/Vue/Angular app:
```typescript
import { FootballWikiClient } from '../api/client';
const api = new FootballWikiClient('https://api.yoursite.com');
```

### 3. CLI Tools
Build command-line tools that interact with your API

### 4. Integration Tests
Write automated tests using the client

## 🔧 Configuration

### Custom Base URL
```typescript
const client = new FootballWikiClient('https://production-api.com');
```

### Custom Timeout
```typescript
import { ApiClient } from './client/ApiClient';

const api = new ApiClient({
  baseURL: 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  headers: {
    'Authorization': 'Bearer token'
  }
});
```

## 📊 Project Structure After Integration

```
football-wiki/
├── src/
│   ├── client/              ← NEW!
│   │   ├── ApiClient.ts
│   │   ├── FootballWikiClient.ts
│   │   ├── example.ts
│   │   └── index.ts
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── migrations/
│   └── index.ts            ← UPDATED with all CRUD endpoints
├── CLIENT_USAGE.md         ← NEW!
└── package.json            ← UPDATED with client:example script
```

## ✅ Summary

You now have:
1. ✅ A fully-typed TypeScript API client
2. ✅ Complete CRUD operations for all resources
3. ✅ Error handling with custom ApiError class
4. ✅ Lodash integration for safe data access
5. ✅ Working example script
6. ✅ Comprehensive documentation
7. ✅ All backend endpoints (GET, POST, PUT, DELETE)

## 🚀 Next Steps

1. **Run migrations** (if not done yet): `npm run migrate:latest`
2. **Start the server**: `npm run dev`
3. **Test the client**: `npm run client:example`
4. **Integrate in your frontend** or use for testing!

The client is production-ready and can be used immediately! 🎉
