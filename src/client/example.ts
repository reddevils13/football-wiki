import { FootballWikiClient, ApiError } from './index';
import { PlayerLevel } from '../models';

async function runExample() {
  const client = new FootballWikiClient('http://localhost:3000');

  console.log('🚀 Football Wiki API Client Example\n');

  try {
    console.log('1. Testing Health Check...');
    const health = await client.health();
    console.log('   ✅ Health:', health);

    console.log('\n2. Testing Hello Endpoint...');
    const hello = await client.hello();
    console.log('   ✅ Hello:', hello);

    console.log('\n3. Creating a Player...');
    const player = await client.createPlayer({
      playerName: 'Lionel Messi',
      level: PlayerLevel.HARD
    });
    console.log('   ✅ Created Player:', player);

    console.log('\n4. Creating a Team...');
    const team = await client.createTeam({
      teamName: 'FC Barcelona'
    });
    console.log('   ✅ Created Team:', team);

    console.log('\n5. Creating a League...');
    const league = await client.createLeague({
      leagueName: 'La Liga'
    });
    console.log('   ✅ Created League:', league);

    console.log('\n6. Creating a Player Career...');
    const career = await client.createPlayerCareer({
      playerId: player.id,
      teamId: team.id,
      leagueId: league.id,
      yearStart: new Date('2004-01-01'),
      yearEnd: new Date('2021-08-10'),
      appearances: 778
    });
    console.log('   ✅ Created Career:', career);

    console.log('\n7. Getting All Players...');
    const allPlayers = await client.getAllPlayers();
    console.log(`   ✅ Total Players: ${allPlayers.length}`);
    console.log('   Players:', allPlayers);

    console.log('\n8. Getting All Teams...');
    const allTeams = await client.getAllTeams();
    console.log(`   ✅ Total Teams: ${allTeams.length}`);
    console.log('   Teams:', allTeams);

    console.log('\n9. Getting All Leagues...');
    const allLeagues = await client.getAllLeagues();
    console.log(`   ✅ Total Leagues: ${allLeagues.length}`);
    console.log('   Leagues:', allLeagues);

    console.log('\n10. Getting Player by ID...');
    const fetchedPlayer = await client.getPlayerById(player.id);
    console.log('   ✅ Fetched Player:', fetchedPlayer);

    console.log('\n11. Updating Player...');
    const updatedPlayer = await client.updatePlayer(player.id, {
      playerName: 'Lionel Andrés Messi'
    });
    console.log('   ✅ Updated Player:', updatedPlayer);

    console.log('\n✨ All operations completed successfully!');

  } catch (error) {
    if (error instanceof ApiError) {
      console.error('\n❌ API Error:');
      console.error('   Message:', error.message);
      console.error('   Status Code:', error.statusCode);
    } else {
      console.error('\n❌ Unexpected Error:', error);
    }
  }
}

if (require.main === module) {
  runExample().catch(console.error);
}

export default runExample;
