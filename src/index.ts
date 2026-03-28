import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { get, isNil } from 'lodash';
import { 
  playerService, 
  teamService, 
  leagueService, 
  playerCareerService, 
  gameService,
  iplScheduleService
} from './container';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow requests from localhost and production
const allowedOrigins: string[] = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.some(allowed => origin.startsWith(allowed)) || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      // Log rejected origins for debugging
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway for now - can tighten later
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getErrorMessage = (error: unknown): string => {
  return get(error, 'message', 'Internal server error');
};

app.get('/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World from Football Wiki API!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

app.get('/players', async (req: Request, res: Response) => {
  try {
    const players = await playerService.getAllPlayers();
    res.json(players);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

app.get('/teams', async (req: Request, res: Response) => {
  try {
    const teams = await teamService.getTeamsWithPlayers();
    res.json(teams);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

app.post('/players', async (req: Request, res: Response) => {
  try {
    const player = await playerService.createPlayer(req.body);
    res.status(201).json(player);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});


app.post('/teams', async (req: Request, res: Response) => {
  try {
    const team = await teamService.createTeam(req.body);
    res.status(201).json(team);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.post('/leagues', async (req: Request, res: Response) => {
  try {
    const league = await leagueService.createLeague(req.body);
    res.status(201).json(league);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.post('/games', async (req: Request, res: Response) => {
  try {
    const level = req.body?.level;
    const teamId = req.body?.teamId;
    const gameWithCareer = await gameService.createRandomGame(level, teamId);
    res.status(201).json(gameWithCareer);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.post('/games/validate-answer', async (req: Request, res: Response) => {
  try {
    const result = await gameService.validateAnswer(req.body);
    res.status(200).json(result);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.get('/games/:gameId/answer', async (req: Request, res: Response) => {
  try {
    const answer = await gameService.getGameAnswer(req.params.gameId);
    res.status(200).json(answer);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});


app.post('/player-careers', async (req: Request, res: Response) => {
  try {
    const career = await playerCareerService.createPlayerCareer(req.body);
    res.status(201).json(career);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

// IPL Schedule endpoints
app.get('/ipl-schedule', async (req: Request, res: Response) => {
  try {
    const schedules = await iplScheduleService.getAllSchedules();
    res.json(schedules);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

app.get('/ipl-schedule/upcoming', async (req: Request, res: Response) => {
  try {
    const schedules = await iplScheduleService.getUpcomingSchedules();
    res.json(schedules);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

app.get('/ipl-schedule/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await iplScheduleService.getScheduleById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

app.post('/ipl-schedule', async (req: Request, res: Response) => {
  try {
    const schedule = await iplScheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.put('/ipl-schedule/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await iplScheduleService.updateSchedule(req.params.id, req.body);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.patch('/ipl-schedule/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await iplScheduleService.patchSchedule(req.params.id, req.body);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.delete('/ipl-schedule/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await iplScheduleService.deleteSchedule(req.params.id);
    res.json({ success: deleted });
  } catch (error: unknown) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Football Wiki API is running on http://localhost:${PORT}`);
  console.log(`📝 Try: http://localhost:${PORT}/hello`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n⏳ Received shutdown signal, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
