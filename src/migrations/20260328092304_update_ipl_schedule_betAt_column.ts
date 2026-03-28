import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('iplSchedule', (table) => {
    table.dropColumn('betAt');
  }).then(() => {
    return knex.schema.alterTable('iplSchedule', (table) => {
      table.string('betAt', 255).nullable().after('betBy');
    });
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('iplSchedule', (table) => {
    table.dropColumn('betAt');
  }).then(() => {
    return knex.schema.alterTable('iplSchedule', (table) => {
      table.datetime('betAt').nullable().after('betBy');
    });
  });
}

