import type { Knex } from "knex";

export const TABLE_NAME = 'playerCareer';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.uuid('playerId').notNullable();
    table.uuid('teamId').notNullable();
    table.uuid('leagueId').notNullable();
    table.date('yearStart').notNullable();
    table.date('yearEnd');
    table.integer('appearances').notNullable();
    
    table.foreign('playerId').references('id').inTable('players').onDelete('CASCADE');
    table.foreign('teamId').references('id').inTable('team').onDelete('CASCADE');
    table.foreign('leagueId').references('id').inTable('leagues').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(TABLE_NAME);
}

