import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('iplSchedule', (table) => {
    table.string('id', 36).primary().notNullable();
    table.datetime('startTime').notNullable();
    table.string('homeTeam', 255).notNullable();
    table.string('awayTeam', 255).notNullable();
    table.string('betBy', 255).nullable();
    table.datetime('betAt').nullable();
    table.string('wonBy', 255).nullable();
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('iplSchedule');
}

