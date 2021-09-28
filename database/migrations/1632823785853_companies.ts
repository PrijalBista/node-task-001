import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // table.integer('category_id').unsigned().references('company_categories.id')
      table
        .integer('category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('company_categories')
        .defaultTo(null)
      table.string('title').notNullable()
      table.string('image')
      table.text('description')
      table.boolean('status').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
