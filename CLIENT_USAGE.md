# Football Wiki API Client

A TypeScript client library for interacting with the Football Wiki API.

## Installation

The client is included in the project. To use it:

```typescript
import { FootballWikiClient } from './client';
```

## Quick Start

### Initialize the Client

```typescript
import { FootballWikiClient } from './client';

// Default: http://localhost:3000
const client = new FootballWikiClient();

// Custom base URL
const client = new FootballWikiClient('https://api.example.com');
```

## Usage Examples

### Health Check

```typescript
// Check API health
const health = await client.health();
console.log(health); // { status: 'healthy', uptime: 123.45 }

// Hello world endpoint
const hello = await client.hello();
console.log(hello); 
// { message: 'Hello World from Football Wiki API!', timestamp: '...', version: '1.0.0' }
```

### Players

```typescript
import { PlayerLevel } from './models';

// Get all players
const players = await client.getAllPlayers();

// Get player by ID
const player = await client.getPlayerById('player-uuid');

// Create a new player
const newPlayer = await client.createPlayer({
  playerName: 'Lionel Messi',
  level: PlayerLevel.HARD
});

// Update a player
const updatedPlayer = await client.updatePlayer('player-uuid', {
  playerName: 'Lionel Andrés Messi',
  level: PlayerLevel.HARD
});

// Delete a player
await client.deletePlayer('player-uuid');
```

### Teams

```typescript
// Get all teams
const teams = await client.getAllTeams();

// Get team by ID
const team = await client.getTeamById('team-uuid');

// Create a new team
const newTeam = await client.createTeam({
  teamName: 'Barcelona'
});

// Update a team
const updatedTeam = await client.updateTeam('team-uuid', {
  teamName: 'FC Barcelona'
});

// Delete a team
await client.deleteTeam('team-uuid');
```

### Leagues

```typescript
// Get all leagues
const leagues = await client.getAllLeagues();

// Get league by ID
const league = await client.getLeagueById('league-uuid');

// Create a new league
const newLeague = await client.createLeague({
  leagueName: 'Premier League'
});

// Update a league
const updatedLeague = await client.updateLeague('league-uuid', {
  leagueName: 'English Premier League'
});

// Delete a league
await client.deleteLeague('league-uuid');
```

### Games

```typescript
// Get all games
const games = await client.getAllGames();

// Get game by ID
const game = await client.getGameById('game-uuid');

// Create a new game
const newGame = await client.createGame({
  playerId: 'player-uuid'
});

// Update a game
const updatedGame = await client.updateGame('game-uuid', {
  playerId: 'new-player-uuid'
});

// Delete a game
await client.deleteGame('game-uuid');
```

### Player Careers

```typescript
// Get all player careers
const careers = await client.getAllPlayerCareers();

// Get player career by ID
const career = await client.getPlayerCareerById('career-uuid');

// Create a new player career
const newCareer = await client.createPlayerCareer({
  playerId: 'player-uuid',
  teamId: 'team-uuid',
  leagueId: 'league-uuid',
  yearStart: new Date('2010-01-01'),
  yearEnd: new Date('2015-12-31'),
  appearances: 150
});

// Update a player career
const updatedCareer = await client.updatePlayerCareer('career-uuid', {
  appearances: 175
});

// Delete a player career
await client.deletePlayerCareer('career-uuid');
```

## Error Handling

The client throws `ApiError` for failed requests:

```typescript
import { FootballWikiClient, ApiError } from './client';

const client = new FootballWikiClient();

try {
  const player = await client.getPlayerById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Complete Example

```typescript
import { FootballWikiClient } from './client';
import { PlayerLevel } from './models';

async function example() {
  const client = new FootballWikiClient('http://localhost:3000');

  try {
    // Create a player
    const player = await client.createPlayer({
      playerName: 'Cristiano Ronaldo',
      level: PlayerLevel.HARD
    });
    console.log('Created player:', player);

    // Create a team
    const team = await client.createTeam({
      teamName: 'Manchester United'
    });
    console.log('Created team:', team);

    // Create a league
    const league = await client.createLeague({
      leagueName: 'Premier League'
    });
    console.log('Created league:', league);

    // Create a player career
    const career = await client.createPlayerCareer({
      playerId: player.id,
      teamId: team.id,
      leagueId: league.id,
      yearStart: new Date('2003-08-01'),
      yearEnd: new Date('2009-06-30'),
      appearances: 292
    });
    console.log('Created career:', career);

    // Get all players
    const allPlayers = await client.getAllPlayers();
    console.log('All players:', allPlayers);

  } catch (error) {
    console.error('Error:', error);
  }
}

example();
```

## API Reference

### FootballWikiClient

#### Constructor
- `new FootballWikiClient(baseURL?: string)` - Create a new client instance

#### Health & Info Methods
- `hello()` - Get hello message
- `health()` - Check API health

#### Player Methods
- `getAllPlayers()` - Get all players
- `getPlayerById(id)` - Get player by ID
- `createPlayer(data)` - Create a new player
- `updatePlayer(id, data)` - Update a player
- `deletePlayer(id)` - Delete a player

#### Team Methods
- `getAllTeams()` - Get all teams
- `getTeamById(id)` - Get team by ID
- `createTeam(data)` - Create a new team
- `updateTeam(id, data)` - Update a team
- `deleteTeam(id)` - Delete a team

#### League Methods
- `getAllLeagues()` - Get all leagues
- `getLeagueById(id)` - Get league by ID
- `createLeague(data)` - Create a new league
- `updateLeague(id, data)` - Update a league
- `deleteLeague(id)` - Delete a league

#### Game Methods
- `getAllGames()` - Get all games
- `getGameById(id)` - Get game by ID
- `createGame(data)` - Create a new game
- `updateGame(id, data)` - Update a game
- `deleteGame(id)` - Delete a game

#### Player Career Methods
- `getAllPlayerCareers()` - Get all player careers
- `getPlayerCareerById(id)` - Get player career by ID
- `createPlayerCareer(data)` - Create a new player career
- `updatePlayerCareer(id, data)` - Update a player career
- `deletePlayerCareer(id)` - Delete a player career

## Features

✅ **Type-Safe** - Full TypeScript support with interfaces
✅ **Error Handling** - Custom ApiError class with status codes
✅ **Lodash Integration** - Safe property access
✅ **Promise-Based** - Async/await support
✅ **Configurable** - Custom base URL and timeouts
✅ **Interceptors** - Automatic error transformation
✅ **Clean API** - Simple, intuitive method names

## Configuration

You can customize the client configuration:

```typescript
import { ApiClient } from './client/ApiClient';

const client = new ApiClient({
  baseURL: 'http://localhost:3000',
  timeout: 5000, // 5 seconds
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
});
```

## Browser Usage

To use this client in a browser environment, you'll need to bundle it with a tool like Webpack, Vite, or Parcel.

## Node.js Usage

The client works out of the box in Node.js applications:

```typescript
import { FootballWikiClient } from './client';

const client = new FootballWikiClient();
const players = await client.getAllPlayers();
```
