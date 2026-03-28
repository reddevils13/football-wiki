import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import db from '../db';
import { uuidv7 } from 'uuidv7';

interface CsvRow {
  date: string;
  time: string;
  'home team': string;
  'away team': string;
}

const parseDateTime = (dateStr: string, timeStr: string): Date => {
  // Parse date format: 28-MAR-26
  const [day, month, year] = dateStr.split('-');
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };
  
  // Parse time format: 7:30 PM
  const [timeValue, period] = timeStr.split(' ');
  const [hours, minutes] = timeValue.split(':').map(Number);
  
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  const fullYear = 2000 + parseInt(year);
  const monthIndex = monthMap[month];
  
  // Create date in IST (UTC+5:30)
  const date = new Date(fullYear, monthIndex, parseInt(day), hour24, minutes, 0);
  
  return date;
};

const seedIplSchedule = async () => {
  try {
    console.log('🏏 Starting IPL Schedule seeding...');
    
    // Read CSV file
    const csvPath = path.join(__dirname, '../../data/ipl_2026_schedule_with_time.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records: CsvRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`📊 Found ${records.length} matches to seed`);
    
    // Clear existing data
    await db('iplSchedule').del();
    console.log('🗑️  Cleared existing schedule data');
    
    // Insert records
    let insertedCount = 0;
    let punjabKingsCount = 0;
    
    for (const record of records) {
      const homeTeam = record['home team'];
      const awayTeam = record['away team'];
      const startTime = parseDateTime(record.date, record.time);
      
      // Check if Punjab Kings is playing
      const isPunjabKingsMatch = homeTeam === 'Punjab Kings' || awayTeam === 'Punjab Kings';
      
      const scheduleData = {
        id: uuidv7(),
        startTime,
        homeTeam,
        awayTeam,
        betBy: isPunjabKingsMatch ? 'Akash Agarwal' : null,
        betAt: isPunjabKingsMatch ? 'Punjab Kings' : null,
        wonBy: null
      };
      
      await db('iplSchedule').insert(scheduleData);
      insertedCount++;
      
      if (isPunjabKingsMatch) {
        punjabKingsCount++;
        console.log(`👑 Punjab Kings match: ${homeTeam} vs ${awayTeam} - Bet by Akash Agarwal`);
      }
    }
    
    console.log(`\n✅ Successfully seeded ${insertedCount} matches`);
    console.log(`👑 Punjab Kings matches with default bet: ${punjabKingsCount}`);
    console.log('🎉 Seeding completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding IPL schedule:', error);
    process.exit(1);
  }
};

seedIplSchedule();
