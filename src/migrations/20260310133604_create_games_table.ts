import type { Knex } from "knex";

export const TABLE_NAME = 'games';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.uuid('playerId').notNullable();
    
    table.foreign('playerId').references('id').inTable('players').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(TABLE_NAME);
}

