# Random Game API

## Endpoint: POST /games

Creates a new game for a randomly selected player and returns the player's career information.

### Request

**Method:** `POST`

**URL:** `/games`

**Body:** Empty (no request body required)

```bash
curl -X POST http://localhost:3000/games
```

### Response

**Status Code:** `201 Created`

**Response Body:**

```json
{
  "gameId": "uuid-v7-here",
  "playerCareer": [
    {
      "teamName": "FC Barcelona",
      "leagueName": "La Liga",
      "yearStart": "2004-01-01T00:00:00.000Z",
      "yearEnd": "2021-08-10T00:00:00.000Z",
      "appearances": 778
    },
    {
      "teamName": "Paris Saint-Germain",
      "leagueName": "Ligue 1",
      "yearStart": "2021-08-10T00:00:00.000Z",
      "yearEnd": null,
      "appearances": 75
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `gameId` | string (UUID) | The unique identifier for the created game |
| `playerCareer` | array | Array of career records for the selected player |
| `playerCareer[].teamName` | string | Name of the team the player played for |
| `playerCareer[].leagueName` | string | Name of the league the team competed in |
| `playerCareer[].yearStart` | string (ISO 8601) | Start date of the player's time at this team |
| `playerCareer[].yearEnd` | string (ISO 8601) or null | End date (null if currently playing) |
| `playerCareer[].appearances` | number | Number of appearances/matches played |

### Behavior

1. **Random Player Selection**: The API randomly selects a player from all available players in the database
2. **Game Creation**: Creates a new game record associated with the selected player
3. **Career Fetching**: Retrieves all career records for the selected player
4. **Data Transformation**: Returns only the team and league names (hides internal IDs and dates)

### Hidden Fields

The following fields from the player career are NOT exposed in the response:
- `playerId` - Player identifier
- `teamId` - Team identifier (replaced with `teamName`)
- `leagueId` - League identifier (replaced with `leagueName`)

### Error Responses

#### No Players Available

**Status Code:** `400 Bad Request`

```json
{
  "error": "No players available to create a game"
}
```

**Cause:** The database has no players to select from.

**Solution:** Create at least one player using `POST /players`

#### Failed Random Selection

**Status Code:** `400 Bad Request`

```json
{
  "error": "Failed to select a random player"
}
```

**Cause:** Internal error during random player selection.

## Implementation Details

### Service Method: `createRandomGame()`

Located in `src/services/GameService.ts`

```typescript
async createRandomGame(): Promise<GameWithCareerResponse> {
  // 1. Get all players
  const allPlayers = await this.playerRepository.findAll();
  
  // 2. Check if players exist
  if (isEmpty(allPlayers)) {
    throw new Error('No players available to create a game');
  }

  // 3. Select random player using lodash sample()
  const randomPlayer = sample(allPlayers);
  
  // 4. Create game
  const game = await this.gameRepository.create({
    playerId: randomPlayer.id
  });

  // 5. Fetch career details with joins
  const careerDetails = await this.playerCareerRepository
    .findPlayerCareerWithDetails(randomPlayer.id);

  // 6. Transform data (teamName, leagueName, dates, appearances)
  const playerCareer = careerDetails.map((career) => ({
    teamName: career.teamName,
    leagueName: career.leagueName,
    yearStart: career.yearStart,
    yearEnd: career.yearEnd,
    appearances: career.appearances
  }));

  // 7. Return response
  return {
    gameId: game.id,
    playerCareer
  };
}
```

### Dependencies

**Lodash functions used:**
- `sample()` - Randomly selects a player from the array
- `isEmpty()` - Checks if the players array is empty
- `isNil()` - Checks for null/undefined values

**Repository methods used:**
- `PlayerRepository.findAll()` - Gets all players
- `GameRepository.create()` - Creates a new game
- `PlayerCareerRepository.findPlayerCareerWithDetails()` - Gets career with joined team/league names

## Usage Examples

### Using cURL

```bash
# Create a random game
curl -X POST http://localhost:3000/games

# Response
{
  "gameId": "01933a45-6789-7abc-def0-123456789012",
  "playerCareer": [
    {
      "teamName": "Manchester United",
      "leagueName": "Premier League",
      "yearStart": "2003-08-01T00:00:00.000Z",
      "yearEnd": "2009-06-30T00:00:00.000Z",
      "appearances": 292
    },
    {
      "teamName": "Real Madrid",
      "leagueName": "La Liga",
      "yearStart": "2009-07-01T00:00:00.000Z",
      "yearEnd": "2018-07-10T00:00:00.000Z",
      "appearances": 438
    }
  ]
}
```

### Using the Client

```typescript
import { FootballWikiClient } from './client';

const client = new FootballWikiClient('http://localhost:3000');

// Create a random game
const response = await client.createRandomGame();

console.log('Game ID:', response.gameId);
console.log('Player Career:', response.playerCareer);

// Output:
// Game ID: 01933a45-6789-7abc-def0-123456789012
// Player Career: [
//   { teamName: 'FC Barcelona', leagueName: 'La Liga' },
//   { teamName: 'PSG', leagueName: 'Ligue 1' }
// ]
```

### Using JavaScript Fetch

```javascript
const response = await fetch('http://localhost:3000/games', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

## Testing the Endpoint

### Prerequisites

Before testing, ensure you have:
1. At least one player in the database
2. At least one team in the database
3. At least one league in the database
4. At least one player career record linking them together

### Setup Test Data

```bash
# Create a player
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Lionel Messi", "level": "HARD"}'

# Save the player ID from response

# Create a team
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -d '{"teamName": "FC Barcelona"}'

# Save the team ID from response

# Create a league
curl -X POST http://localhost:3000/leagues \
  -H "Content-Type: application/json" \
  -d '{"leagueName": "La Liga"}'

# Save the league ID from response

# Create a player career
curl -X POST http://localhost:3000/player-careers \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "player-uuid",
    "teamId": "team-uuid",
    "leagueId": "league-uuid",
    "yearStart": "2004-01-01",
    "yearEnd": "2021-08-10",
    "appearances": 778
  }'

# Now test the random game endpoint
curl -X POST http://localhost:3000/games
```

## Database Tables Used

### games
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  playerId UUID FOREIGN KEY REFERENCES players(id)
)
```

### playerCareer (with joins)
```sql
SELECT 
  playerCareer.*,
  team.teamName,
  leagues.leagueName
FROM playerCareer
JOIN team ON playerCareer.teamId = team.id
JOIN leagues ON playerCareer.leagueId = leagues.id
WHERE playerCareer.playerId = ?
```

## Notes

- The endpoint always creates a new game, even for the same player
- Each request will randomly select a player, so results may vary
- If a player has no career records, the `playerCareer` array will be empty
- The `gameId` is a UUIDv7 for time-based sorting
- This endpoint is idempotent-safe (multiple calls create multiple games)

## Future Enhancements

Potential improvements:
1. Add query parameter to select player by level (EASY, MEDIUM, HARD)
2. Return player name along with career information
3. Add pagination for players with many career records
4. Cache player list for better performance
5. Add analytics/statistics in the response
