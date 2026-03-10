# Database Seed Script

## Overview

The seed script (`src/scripts/seed-database.ts`) populates the database with players, teams, leagues, and player career data from the CSV file located at `data/football-wiki.csv`.

## Usage

### Run the seed script:

```bash
npm run seed
```

**Important:** Make sure you have run the migrations first:

```bash
npm run migrate:latest
```

## What it does

The script performs the following operations in order:

1. **Reads CSV file** - Parses `data/football-wiki.csv`
2. **Extracts unique data**:
   - Unique players (by player ID)
   - Unique teams (by team name)
   - Unique leagues (by league name)
3. **Creates database records**:
   - Creates all players with random difficulty levels (EASY, MEDIUM, HARD)
   - Creates all teams
   - Creates all leagues
   - Creates player career records linking players to teams and leagues

## CSV Format

The CSV file should have the following columns:

- `player` - Player ID (Wikidata URL)
- `playerLabel` - Player name
- `clubLabel` - Team/club name
- `leagueLabel` - League name
- `start` - Career start date (ISO 8601)
- `end` - Career end date (ISO 8601, can be empty for current)
- `caps` - Number of appearances/caps

## Features

### Progress Tracking

The script shows real-time progress:

```
🌱 Starting database seed...

📖 Reading CSV file...
   Found 595 unique players
   Found 67 unique teams
   Found 5 unique leagues
   Found 1929 career records

👤 Creating players...
   Created 50/595 players...
   Created 100/595 players...
   ✅ Created 595 players

⚽ Creating teams...
   Created 50/67 teams...
   ✅ Created 67 teams

🏆 Creating leagues...
   ✅ Created 5 leagues

📊 Creating player career records...
   Created 100 career records...
   Created 200 career records...
   ✅ Created 1857 career records
   ⚠️  Skipped 72 records (missing data or errors)
```

### Player Level Assignment

Players are automatically assigned a difficulty level based on a hash of their name:
- **EASY** - Easier to guess
- **MEDIUM** - Medium difficulty
- **HARD** - Harder to guess

The assignment is deterministic (same name always gets same level) but distributed evenly.

### Error Handling

- Skips records with missing required data
- Shows warnings for failed operations
- Continues processing even if some records fail
- Provides a summary of successes and failures

### Data Validation

The script validates:
- Player, team, and league names exist
- Start dates are valid
- Appearances are numeric
- Foreign key relationships are valid

## Example Output

```bash
$ npm run seed

🌱 Starting database seed...

📖 Reading CSV file...
   Found 595 unique players
   Found 67 unique teams
   Found 5 unique leagues
   Found 1929 career records

👤 Creating players...
   Created 50/595 players...
   Created 100/595 players...
   Created 150/595 players...
   ...
   ✅ Created 595 players

⚽ Creating teams...
   Created 50/67 teams...
   ✅ Created 67 teams

🏆 Creating leagues...
   ✅ Created 5 leagues

📊 Creating player career records...
   Created 100 career records...
   Created 200 career records...
   ...
   ✅ Created 1857 career records
   ⚠️  Skipped 72 records (missing data or errors)

✨ Database seeding completed!

Summary:
   Players: 595
   Teams: 67
   Leagues: 5
   Career Records: 1857

🎉 Seed completed successfully!
```

## Database Schema Populated

After running the seed script, your database will contain:

### `players` table
- Player names from CSV
- Auto-assigned difficulty levels (EASY, MEDIUM, HARD)
- UUIDv7 identifiers

### `team` table
- All unique team names from CSV
- UUIDv7 identifiers

### `leagues` table
- All unique league names from CSV
- UUIDv7 identifiers

### `playerCareer` table
- Links between players, teams, and leagues
- Start and end dates
- Number of appearances
- UUIDv7 identifiers

## Performance

The script processes records sequentially to:
- Avoid database connection issues
- Show accurate progress
- Handle errors gracefully

For the example CSV with ~1900 records, the script typically takes:
- **Players**: ~30-60 seconds
- **Teams**: ~5-10 seconds
- **Leagues**: ~1-2 seconds
- **Career Records**: ~2-4 minutes

**Total time**: Approximately 3-5 minutes

## Re-running the Script

### To re-seed the database:

1. **Rollback all migrations** (this will delete all data):
   ```bash
   npm run migrate:rollback
   ```

2. **Re-run migrations**:
   ```bash
   npm run migrate:latest
   ```

3. **Run seed script again**:
   ```bash
   npm run seed
   ```

### Alternative: Drop and recreate database

For MySQL:
```bash
mysql -u local -plocal -e "DROP DATABASE football_wiki; CREATE DATABASE football_wiki;"
npm run migrate:latest
npm run seed
```

## Troubleshooting

### "Player not found" errors in career creation

This usually means the player wasn't created successfully. Check earlier in the output for player creation errors.

### "Team not found" or "League not found" errors

Similar to above - check if the teams/leagues were created successfully.

### Database connection errors

Make sure your `.env` file has correct database credentials:
```env
DB_CLIENT=mysql2
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=local
DB_PASSWORD=local
DB_NAME=football_wiki
```

### CSV parsing errors

Ensure the CSV file:
- Exists at `data/football-wiki.csv`
- Has the correct format
- Uses UTF-8 encoding
- Has headers as the first line

## Code Structure

```typescript
// Main functions in seed-database.ts

parseCSV(filePath) 
  // Reads CSV and extracts unique players, teams, leagues

assignPlayerLevel(playerName)
  // Assigns EASY/MEDIUM/HARD level based on name hash

seedDatabase()
  // Main function that:
  // 1. Parses CSV
  // 2. Creates players
  // 3. Creates teams
  // 4. Creates leagues
  // 5. Creates career records
  // 6. Shows summary
```

## Notes

- The script automatically closes the database connection when finished
- Failed records are logged but don't stop the entire process
- Progress is shown every 50 records for players/teams and every 100 for careers
- Player levels are deterministic based on name hash
- Empty `end` dates in CSV are treated as current (ongoing careers)

## Next Steps

After seeding:

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Test the Random Game API**:
   ```bash
   curl -X POST http://localhost:3000/games
   ```

3. **Query players**:
   ```bash
   curl http://localhost:3000/players
   ```

The database is now fully populated and ready to use! 🎉
