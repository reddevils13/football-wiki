# Football Wiki Backend - Quick Start Guide

## What's Been Created

A complete TypeScript backend with:
- ✅ 5 Database tables (players, team, leagues, playerCareer, games)
- ✅ Models layer with TypeScript interfaces and DTOs
- ✅ Repository layer for database operations
- ✅ Service layer for business logic
- ✅ Dependency injection container
- ✅ RESTful API endpoints

## Architecture Overview

```
API Routes (index.ts)
    ↓
Services (Business Logic)
    ↓
Repositories (Database Access)
    ↓
Database (MySQL)
```

## Quick Usage

### 1. Import Services
```typescript
import { 
  playerService,
  teamService,
  leagueService,
  playerCareerService,
  gameService 
} from './container';
```

### 2. Use in Your Code
```typescript
// Create a player
const player = await playerService.createPlayer({
  playerName: 'Lionel Messi',
  level: 'HARD'
});

// Get all players
const players = await playerService.getAllPlayers();

// Create a team
const team = await teamService.createTeam({
  teamName: 'Barcelona'
});
```

### 3. API Endpoints Available

**Players:**
- `GET /api/players` - List all
- `POST /api/players` - Create new
- `GET /api/players/:id` - Get one

**Teams:**
- `GET /api/teams` - List all
- `POST /api/teams` - Create new

**Leagues:**
- `GET /api/leagues` - List all
- `POST /api/leagues` - Create new

**Games:**
- `GET /api/games` - List all
- `POST /api/games` - Create new

**Player Careers:**
- `GET /api/player-careers` - List all
- `POST /api/player-careers` - Create new

## Testing the API

### Create a Player
```bash
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Lionel Messi", "level": "HARD"}'
```

### Get All Players
```bash
curl http://localhost:3000/api/players
```

### Create a Team
```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"teamName": "Barcelona"}'
```

## File Structure

```
src/
├── models/                 # Data types & DTOs
│   ├── Player.ts
│   ├── Team.ts
│   ├── League.ts
│   ├── PlayerCareer.ts
│   └── Game.ts
├── repositories/           # Database queries
│   ├── PlayerRepository.ts
│   ├── TeamRepository.ts
│   ├── LeagueRepository.ts
│   ├── PlayerCareerRepository.ts
│   └── GameRepository.ts
├── services/              # Business logic
│   ├── PlayerService.ts
│   ├── TeamService.ts
│   ├── LeagueService.ts
│   ├── PlayerCareerService.ts
│   └── GameService.ts
├── container.ts           # Dependency injection
└── index.ts              # API routes
```

## Next Steps

1. **Run migrations** (if not done yet):
   ```bash
   npm run migrate:latest
   ```

2. **Start the server**:
   ```bash
   npm run dev
   ```

3. **Test the endpoints** using curl or Postman

4. **Add more endpoints** by following the pattern in `src/index.ts`

## Key Features

✅ **Type Safety** - Full TypeScript support
✅ **Validation** - Built-in at service layer
✅ **Foreign Keys** - Automatic validation
✅ **UUIDv7** - Modern UUID generation
✅ **Clean Architecture** - Separation of concerns
✅ **Error Handling** - Meaningful error messages
✅ **Dependency Injection** - Easy to test and maintain

For detailed documentation, see `ARCHITECTURE.md`
