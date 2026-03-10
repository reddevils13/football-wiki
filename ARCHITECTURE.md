# Football Wiki - Architecture Documentation

## Project Structure

```
src/
├── models/              # Data models and DTOs
│   ├── Player.ts
│   ├── Team.ts
│   ├── League.ts
│   ├── PlayerCareer.ts
│   ├── Game.ts
│   └── index.ts
├── repositories/        # Data access layer
│   ├── PlayerRepository.ts
│   ├── TeamRepository.ts
│   ├── LeagueRepository.ts
│   ├── PlayerCareerRepository.ts
│   ├── GameRepository.ts
│   └── index.ts
├── services/           # Business logic layer
│   ├── PlayerService.ts
│   ├── TeamService.ts
│   ├── LeagueService.ts
│   ├── PlayerCareerService.ts
│   ├── GameService.ts
│   └── index.ts
├── migrations/         # Database migrations
├── container.ts        # Dependency injection container
├── db.ts              # Database connection
├── knexfile.ts        # Knex configuration
└── index.ts           # Express app and API routes
```

## Architecture Layers

### 1. Models Layer (`src/models/`)

Defines TypeScript interfaces for data structures and DTOs (Data Transfer Objects).

**Example:**
```typescript
// Player model
export interface Player {
  id: string;
  playerName: string;
  level: PlayerLevel;
}

export interface CreatePlayerDTO {
  playerName: string;
  level: PlayerLevel;
}
```

### 2. Repository Layer (`src/repositories/`)

Handles all database operations using Knex query builder. Each repository manages CRUD operations for a specific table.

**Features:**
- Create, Read, Update, Delete operations
- Custom query methods (e.g., `findByLevel`, `findByName`)
- UUIDv7 generation for primary keys
- Automatic join queries for related data

**Example:**
```typescript
const playerRepository = new PlayerRepository(db);
const player = await playerRepository.create({
  playerName: 'Lionel Messi',
  level: PlayerLevel.HARD
});
```

### 3. Service Layer (`src/services/`)

Contains business logic and validation rules. Services use repositories to interact with the database.

**Features:**
- Input validation
- Business rule enforcement
- Foreign key validation
- Error handling with meaningful messages

**Example:**
```typescript
const playerService = new PlayerService(playerRepository);
const player = await playerService.createPlayer({
  playerName: 'Cristiano Ronaldo',
  level: PlayerLevel.HARD
});
```

### 4. Dependency Injection Container (`src/container.ts`)

Centralizes the instantiation of repositories and services, managing dependencies.

**Example:**
```typescript
import { playerService, teamService } from './container';

// Use services directly
const players = await playerService.getAllPlayers();
```

## Database Schema

### Tables

#### 1. **players**
- `id` (UUID, Primary Key)
- `playerName` (VARCHAR 255)
- `level` (ENUM: 'EASY', 'MEDIUM', 'HARD')

#### 2. **team**
- `id` (UUID, Primary Key)
- `teamName` (VARCHAR 255)

#### 3. **leagues**
- `id` (UUID, Primary Key)
- `leagueName` (VARCHAR 255)

#### 4. **playerCareer**
- `id` (UUID, Primary Key)
- `playerId` (UUID, Foreign Key → players.id)
- `teamId` (UUID, Foreign Key → team.id)
- `leagueId` (UUID, Foreign Key → leagues.id)
- `yearStart` (DATE)
- `yearEnd` (DATE, nullable)
- `appearances` (INT)

#### 5. **games**
- `id` (UUID, Primary Key)
- `playerId` (UUID, Foreign Key → players.id)

## API Endpoints

### Players

- `GET /api/players` - Get all players
- `POST /api/players` - Create a new player
  ```json
  {
    "playerName": "Lionel Messi",
    "level": "HARD"
  }
  ```
- `GET /api/players/:id` - Get player by ID

### Teams

- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
  ```json
  {
    "teamName": "Barcelona"
  }
  ```

### Leagues

- `GET /api/leagues` - Get all leagues
- `POST /api/leagues` - Create a new league
  ```json
  {
    "leagueName": "Premier League"
  }
  ```

### Games

- `GET /api/games` - Get all games
- `POST /api/games` - Create a new game
  ```json
  {
    "playerId": "uuid-here"
  }
  ```

### Player Careers

- `GET /api/player-careers` - Get all player careers
- `POST /api/player-careers` - Create a new player career
  ```json
  {
    "playerId": "uuid-here",
    "teamId": "uuid-here",
    "leagueId": "uuid-here",
    "yearStart": "2010-01-01",
    "yearEnd": "2015-12-31",
    "appearances": 150
  }
  ```

## Usage Examples

### Creating a Player

```typescript
import { playerService } from './container';
import { PlayerLevel } from './models';

const player = await playerService.createPlayer({
  playerName: 'Lionel Messi',
  level: PlayerLevel.HARD
});
```

### Getting Player Career with Details

```typescript
import { playerCareerService } from './container';

const careers = await playerCareerService.getPlayerCareerWithDetails(playerId);
// Returns player career data with team and league names joined
```

### Creating a Game

```typescript
import { gameService } from './container';

const game = await gameService.createGame({
  playerId: 'player-uuid-here'
});
```

## Service Layer Validations

### PlayerService
- Validates player level is one of: EASY, MEDIUM, HARD
- Ensures player exists before update/delete

### TeamService
- Validates team name is not empty
- Ensures team exists before update/delete

### LeagueService
- Validates league name is not empty
- Ensures league exists before update/delete

### PlayerCareerService
- Validates player, team, and league exist
- Ensures yearEnd is not before yearStart
- Validates appearances is not negative

### GameService
- Validates player exists
- Ensures game exists before update/delete

## Error Handling

All services throw descriptive errors that are caught and returned as JSON responses:

```json
{
  "error": "Player not found"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Development Workflow

1. **Run migrations**: `npm run migrate:latest`
2. **Start dev server**: `npm run dev`
3. **Create new migration**: `npm run migrate:make migration_name`
4. **Rollback migration**: `npm run migrate:rollback`
5. **Check migration status**: `npm run migrate:status`

## Best Practices

1. **Always use services in API routes** - Never call repositories directly
2. **DTOs for type safety** - Use CreateDTO and UpdateDTO interfaces
3. **Validate at service layer** - Keep business logic in services
4. **UUID v7 for IDs** - Automatically generated in repositories
5. **Foreign key validation** - Services check related entities exist
6. **Error handling** - All async operations wrapped in try-catch
