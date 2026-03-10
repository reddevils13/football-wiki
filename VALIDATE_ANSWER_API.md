# Validate Answer API

## Endpoint: POST /games/validate-answer

Validates a player's answer for a game by checking if the submitted player ID matches the correct player ID for the game.

## Request

**Method:** `POST`

**URL:** `/games/validate-answer`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**

```json
{
  "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
  "playerId": "019cd81a-1234-7890-abcd-ef1234567890"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gameId` | string (UUID) | Yes | The ID of the game to validate |
| `playerId` | string (UUID) | Yes | The ID of the player being guessed |

## Response

### Success Response (Correct Answer)

**Status Code:** `200 OK`

```json
{
  "correct": true,
  "message": "Correct! You guessed the player correctly.",
  "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
  "submittedPlayerId": "019cd81a-1234-7890-abcd-ef1234567890"
}
```

### Success Response (Incorrect Answer)

**Status Code:** `200 OK`

```json
{
  "correct": false,
  "message": "Incorrect. The player you guessed is not correct.",
  "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
  "submittedPlayerId": "019cd81a-1234-7890-abcd-ef1234567890",
  "correctPlayerId": "019cd81a-5678-7890-abcd-ef0987654321"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `correct` | boolean | `true` if the answer is correct, `false` otherwise |
| `message` | string | Human-readable message about the result |
| `gameId` | string (UUID) | The ID of the game that was validated |
| `submittedPlayerId` | string (UUID) | The player ID that was submitted |
| `correctPlayerId` | string (UUID) | The correct player ID (only included when incorrect) |

## Error Responses

### Game Not Found

**Status Code:** `400 Bad Request`

```json
{
  "error": "Game not found"
}
```

### Player Not Found

**Status Code:** `400 Bad Request`

```json
{
  "error": "Submitted player not found"
}
```

### Invalid Request Body

**Status Code:** `400 Bad Request`

```json
{
  "error": "Invalid request data"
}
```

## Usage Examples

### Using cURL (Correct Answer)

```bash
curl -X POST http://localhost:3000/games/validate-answer \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
    "playerId": "019cd81a-1234-7890-abcd-ef1234567890"
  }'
```

**Response:**
```json
{
  "correct": true,
  "message": "Correct! You guessed the player correctly.",
  "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
  "submittedPlayerId": "019cd81a-1234-7890-abcd-ef1234567890"
}
```

### Using cURL (Incorrect Answer)

```bash
curl -X POST http://localhost:3000/games/validate-answer \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
    "playerId": "019cd81a-9999-7890-abcd-wrongplayer"
  }'
```

**Response:**
```json
{
  "correct": false,
  "message": "Incorrect. The player you guessed is not correct.",
  "gameId": "019cd81e-00fa-7013-a5fc-12b723576758",
  "submittedPlayerId": "019cd81a-9999-7890-abcd-wrongplayer",
  "correctPlayerId": "019cd81a-1234-7890-abcd-ef1234567890"
}
```

### Using the Client

```typescript
import { FootballWikiClient } from './client';

const client = new FootballWikiClient('http://localhost:3000');

// Create a game first
const game = await client.createRandomGame();
console.log('Game ID:', game.gameId);
console.log('Player Career:', game.playerCareer);

// Get player ID from somewhere (e.g., user selection)
const guessedPlayerId = '019cd81a-1234-7890-abcd-ef1234567890';

// Validate the answer
const result = await client.validateAnswer({
  gameId: game.gameId,
  playerId: guessedPlayerId
});

if (result.correct) {
  console.log('✅ Correct!', result.message);
} else {
  console.log('❌ Incorrect!', result.message);
  console.log('Correct player ID:', result.correctPlayerId);
}
```

### Using JavaScript Fetch

```javascript
const response = await fetch('http://localhost:3000/games/validate-answer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    gameId: '019cd81e-00fa-7013-a5fc-12b723576758',
    playerId: '019cd81a-1234-7890-abcd-ef1234567890'
  })
});

const result = await response.json();

if (result.correct) {
  console.log('Correct answer!');
} else {
  console.log('Wrong answer. Correct player:', result.correctPlayerId);
}
```

## Complete Game Flow Example

```typescript
import { FootballWikiClient } from './client';

const client = new FootballWikiClient('http://localhost:3000');

// 1. Create a new game
const game = await client.createRandomGame();
console.log('New game created:', game.gameId);
console.log('Career hints:');
game.playerCareer.forEach((career, index) => {
  console.log(`${index + 1}. ${career.teamName} (${career.leagueName})`);
  console.log(`   ${career.yearStart} - ${career.yearEnd || 'Present'}`);
  console.log(`   Appearances: ${career.appearances}`);
});

// 2. Get all players to choose from
const players = await client.getAllPlayers();
console.log(`\nAvailable players: ${players.length}`);

// 3. User makes a guess (simulate by picking first player)
const guessedPlayer = players[0];
console.log(`\nGuessing: ${guessedPlayer.playerName}`);

// 4. Validate the answer
const result = await client.validateAnswer({
  gameId: game.gameId,
  playerId: guessedPlayer.id
});

// 5. Show result
console.log(`\nResult: ${result.correct ? '✅ CORRECT!' : '❌ INCORRECT'}`);
console.log(result.message);

if (!result.correct && result.correctPlayerId) {
  // Optionally fetch the correct player's name
  const correctPlayer = await client.getPlayerById(result.correctPlayerId);
  console.log(`The correct answer was: ${correctPlayer.playerName}`);
}
```

## Implementation Details

### Service Method: `validateAnswer()`

Located in `src/services/GameService.ts`

```typescript
async validateAnswer(data: SubmitAnswerDTO): Promise<AnswerValidationResponse> {
  // 1. Fetch the game
  const game = await this.gameRepository.findById(data.gameId);
  if (isNil(game)) {
    throw new Error('Game not found');
  }

  // 2. Validate submitted player exists
  const submittedPlayer = await this.playerRepository.findById(data.playerId);
  if (isNil(submittedPlayer)) {
    throw new Error('Submitted player not found');
  }

  // 3. Compare player IDs
  const isCorrect = game.playerId === data.playerId;

  // 4. Return result
  if (isCorrect) {
    return {
      correct: true,
      message: 'Correct! You guessed the player correctly.',
      gameId: data.gameId,
      submittedPlayerId: data.playerId
    };
  } else {
    return {
      correct: false,
      message: 'Incorrect. The player you guessed is not correct.',
      gameId: data.gameId,
      submittedPlayerId: data.playerId,
      correctPlayerId: game.playerId
    };
  }
}
```

## Validation Logic

The endpoint performs the following validations:

1. ✅ **Game Exists** - Checks if the game ID is valid
2. ✅ **Player Exists** - Checks if the submitted player ID is valid
3. ✅ **Exact Match** - Compares the submitted player ID with the game's player ID
4. ✅ **Returns Correct Player** - On incorrect answer, reveals the correct player ID

## Security Considerations

- The correct player ID is only revealed when the answer is incorrect
- No rate limiting is implemented (consider adding for production)
- Player names are not exposed in the response (only IDs)

## Use Cases

### 1. Quiz/Guessing Game
Players guess which footballer the career belongs to based on team/league history.

### 2. Multiple Attempts
The same game can be validated multiple times with different player IDs.

### 3. Learning Tool
When incorrect, users can see the correct answer to learn.

## Database Tables Used

### `games` table
```sql
SELECT * FROM games WHERE id = ?
-- Returns: id, playerId
```

### `players` table
```sql
SELECT * FROM players WHERE id = ?
-- Validates: submitted player exists
```

## Response Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Validation successful (answer may be correct or incorrect) |
| `400` | Bad request (game not found, player not found, invalid data) |
| `500` | Internal server error |

## Notes

- The endpoint returns `200 OK` for both correct and incorrect answers
- Check the `correct` field in the response to determine if the answer was right
- The `correctPlayerId` is only included when the answer is incorrect
- Multiple validations for the same game are allowed
- No game state is modified by this endpoint (read-only validation)

## Future Enhancements

Potential improvements:
1. Track number of attempts per game
2. Implement scoring system
3. Add time-based challenges
4. Store user's answer history
5. Add hints system (reveal one team at a time)
6. Leaderboard functionality
