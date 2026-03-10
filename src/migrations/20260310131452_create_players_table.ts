import type { Knex } from "knex";

export const TABLE_NAME = 'players';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.string('playerName', 255).notNullable();
    table.enum('level', ['EASY', 'MEDIUM', 'HARD']).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(TABLE_NAME);
}

