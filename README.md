# Football Wiki API

A TypeScript-powered backend for football wiki.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env` and configure your database credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your actual database credentials:

```env
PORT=3000
NODE_ENV=development

# For MySQL (recommended for production)
DB_CLIENT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=football_wiki

# Or keep DB_CLIENT=sqlite3 for local development
```

**Important:** Never commit your `.env` file to git. It's already included in `.gitignore`.

3. Run database migrations:

```bash
npm run migrate:latest
```

### Running the Application

#### Development mode (with hot reload):

```bash
npm run dev
```

#### Production build:

```bash
npm run build
npm start
```

## API Endpoints

### Hello World
- **GET** `/api/hello`
- Returns a welcome message

Example response:
```json
{
  "message": "Hello World from Football Wiki API!",
  "timestamp": "2026-03-10T18:37:00.000Z",
  "version": "1.0.0"
}
```

### Health Check
- **GET** `/api/health`
- Returns server health status

Example response:
```json
{
  "status": "healthy",
  "uptime": 123.456
}
```

## Project Structure

```
football-wiki/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── db.ts             # Database connection
│   ├── knexfile.ts       # Knex configuration
│   ├── migrations/       # Database migrations
│   └── seeds/            # Database seeds
├── data/                 # SQLite database files
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint

### Database Migration Scripts

- `npm run migrate:make <migration_name>` - Create a new migration file
- `npm run migrate:latest` - Run all pending migrations
- `npm run migrate:rollback` - Rollback the last batch of migrations
- `npm run migrate:status` - Check migration status

## Database Setup

This project uses Knex.js as the query builder and SQLite as the database.

### Creating a New Migration

To create a new migration file:

```bash
npm run migrate:make create_players_table
```

This will create a timestamped migration file in `src/migrations/`.

### Running Migrations

To run all pending migrations:

```bash
npm run migrate:latest
```

### Rolling Back Migrations

To rollback the last batch of migrations:

```bash
npm run migrate:rollback
```

### Example Migration

The project includes an example migration for a `teams` table:

```typescript
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('teams', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('country', 100).notNullable();
    table.string('city', 100);
    table.integer('founded_year');
    table.string('stadium', 255);
    table.text('description');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('teams');
}
```

## License

ISC
