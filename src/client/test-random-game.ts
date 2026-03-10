import { FootballWikiClient } from './index';
import { PlayerLevel } from '../models';

async function testRandomGameAPI() {
  const client = new FootballWikiClient('http://localhost:3000');

  console.log('🎮 Testing Random Game API\n');

  try {
    console.log('1. Creating test data...\n');

    const player = await client.createPlayer({
      playerName: 'Cristiano Ronaldo',
      level: PlayerLevel.HARD
    });
    console.log('   ✅ Created Player:', player.playerName);

    const team1 = await client.createTeam({
      teamName: 'Manchester United'
    });
    console.log('   ✅ Created Team:', team1.teamName);

    const team2 = await client.createTeam({
      teamName: 'Real Madrid'
    });
    console.log('   ✅ Created Team:', team2.teamName);

    const league1 = await client.createLeague({
      leagueName: 'Premier League'
    });
    console.log('   ✅ Created League:', league1.leagueName);

    const league2 = await client.createLeague({
      leagueName: 'La Liga'
    });
    console.log('   ✅ Created League:', league2.leagueName);

    const career1 = await client.createPlayerCareer({
      playerId: player.id,
      teamId: team1.id,
      leagueId: league1.id,
      yearStart: new Date('2003-08-01'),
      yearEnd: new Date('2009-06-30'),
      appearances: 292
    });
    console.log('   ✅ Created Career 1: Manchester United - Premier League');

    const career2 = await client.createPlayerCareer({
      playerId: player.id,
      teamId: team2.id,
      leagueId: league2.id,
      yearStart: new Date('2009-07-01'),
      yearEnd: new Date('2018-07-10'),
      appearances: 438
    });
    console.log('   ✅ Created Career 2: Real Madrid - La Liga\n');

    console.log('2. Creating Random Game...\n');
    
    const gameResponse = await client.createRandomGame();
    
    console.log('   ✅ Game Created!');
    console.log('   Game ID:', gameResponse.gameId);
    console.log('   Player Career:\n');
    
    gameResponse.playerCareer.forEach((career, index) => {
      console.log(`   ${index + 1}. ${career.teamName} (${career.leagueName})`);
    });

    console.log('\n3. Testing Multiple Game Creations...\n');

    for (let i = 0; i < 3; i++) {
      const game = await client.createRandomGame();
      console.log(`   Game ${i + 1}:`, game.gameId);
      console.log(`   Careers: ${game.playerCareer.length} records`);
    }

    console.log('\n✨ All tests passed successfully!');

  } catch (error: unknown) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

if (require.main === module) {
  testRandomGameAPI().catch(console.error);
}

export default testRandomGameAPI;
