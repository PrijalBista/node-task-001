import { DateTime } from 'luxon'
import { hasMany, HasMany, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'
export default class CompanyCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Company, {
    foreignKey: 'categoryId',
  })
  public companies: HasMany<typeof Company>
}
