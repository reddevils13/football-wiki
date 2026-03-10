import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { uniq, sample } from 'lodash';
import db from '../db';
import { playerService, teamService, leagueService, playerCareerService } from '../container';
import { PlayerLevel } from '../models/Player';

interface CSVRow {
  player: string;
  playerLabel: string;
  clubLabel: string;
  leagueLabel: string;
  start: string;
  end: string;
  caps: string;
}

interface ParsedData {
  players: Map<string, string>; // playerId -> playerName
  teams: Set<string>;
  leagues: Set<string>;
  careers: Array<{
    playerId: string;
    playerName: string;
    teamName: string;
    leagueName: string;
    start: string;
    end: string;
    caps: string;
  }>;
}

async function parseCSV(filePath: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const data: ParsedData = {
      players: new Map(),
      teams: new Set(),
      leagues: new Set(),
      careers: []
    };

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        const playerId = row.player;
        const playerName = row.playerLabel;
        const teamName = row.clubLabel;
        const leagueName = row.leagueLabel;

        if (playerId && playerName) {
          data.players.set(playerId, playerName);
        }

        if (teamName) {
          data.teams.add(teamName);
        }

        if (leagueName) {
          data.leagues.add(leagueName);
        }

        data.careers.push({
          playerId,
          playerName,
          teamName,
          leagueName,
          start: row.start,
          end: row.end,
          caps: row.caps
        });
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}

function assignPlayerLevel(playerName: string): PlayerLevel {
  const hash = playerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const levels = [PlayerLevel.EASY, PlayerLevel.MEDIUM, PlayerLevel.HARD];
  return levels[hash % 3];
}

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    const csvPath = path.resolve(__dirname, '../../data/football-wiki.csv');
    
    console.log('📖 Reading CSV file...');
    const data = await parseCSV(csvPath);

    console.log(`   Found ${data.players.size} unique players`);
    console.log(`   Found ${data.teams.size} unique teams`);
    console.log(`   Found ${data.leagues.size} unique leagues`);
    console.log(`   Found ${data.careers.length} career records\n`);

    const playerMap = new Map<string, { id: string; name: string }>();
    const teamMap = new Map<string, string>();
    const leagueMap = new Map<string, string>();

    console.log('👤 Creating players...');
    let playerCount = 0;
    for (const [playerId, playerName] of data.players) {
      try {
        const level = assignPlayerLevel(playerName);
        const player = await playerService.createPlayer({
          playerName,
          level
        });
        playerMap.set(playerId, { id: player.id, name: playerName });
        playerCount++;
        
        if (playerCount % 50 === 0) {
          console.log(`   Created ${playerCount}/${data.players.size} players...`);
        }
      } catch (error: unknown) {
        console.error(`   ⚠️  Failed to create player ${playerName}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    console.log(`   ✅ Created ${playerCount} players\n`);

    console.log('⚽ Creating teams...');
    let teamCount = 0;
    for (const teamName of Array.from(data.teams)) {
      try {
        const team = await teamService.createTeam({ teamName });
        teamMap.set(teamName, team.id);
        teamCount++;
        
        if (teamCount % 50 === 0) {
          console.log(`   Created ${teamCount}/${data.teams.size} teams...`);
        }
      } catch (error: unknown) {
        console.error(`   ⚠️  Failed to create team ${teamName}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    console.log(`   ✅ Created ${teamCount} teams\n`);

    console.log('🏆 Creating leagues...');
    let leagueCount = 0;
    for (const leagueName of Array.from(data.leagues)) {
      try {
        const league = await leagueService.createLeague({ leagueName });
        leagueMap.set(leagueName, league.id);
        leagueCount++;
      } catch (error: unknown) {
        console.error(`   ⚠️  Failed to create league ${leagueName}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    console.log(`   ✅ Created ${leagueCount} leagues\n`);

    console.log('📊 Creating player career records...');
    let careerCount = 0;
    let skippedCount = 0;

    for (const career of data.careers) {
      const playerData = playerMap.get(career.playerId);
      const teamId = teamMap.get(career.teamName);
      const leagueId = leagueMap.get(career.leagueName);

      if (!playerData || !teamId || !leagueId) {
        skippedCount++;
        continue;
      }

      if (!career.start || !career.caps) {
        skippedCount++;
        continue;
      }

      try {
        const appearances = parseInt(career.caps) || 0;
        const yearStart = new Date(career.start);
        const yearEnd = career.end ? new Date(career.end) : undefined;

        await playerCareerService.createPlayerCareer({
          playerId: playerData.id,
          teamId,
          leagueId,
          yearStart,
          yearEnd,
          appearances
        });

        careerCount++;

        if (careerCount % 100 === 0) {
          console.log(`   Created ${careerCount} career records...`);
        }
      } catch (error: unknown) {
        skippedCount++;
      }
    }

    console.log(`   ✅ Created ${careerCount} career records`);
    console.log(`   ⚠️  Skipped ${skippedCount} records (missing data or errors)\n`);

    console.log('✨ Database seeding completed!\n');
    console.log('Summary:');
    console.log(`   Players: ${playerCount}`);
    console.log(`   Teams: ${teamCount}`);
    console.log(`   Leagues: ${leagueCount}`);
    console.log(`   Career Records: ${careerCount}`);

  } catch (error: unknown) {
    console.error('❌ Error seeding database:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n🎉 Seed completed successfully!');
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error('\n💥 Seed failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
