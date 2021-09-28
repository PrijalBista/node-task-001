import { DateTime } from 'luxon'
import { belongsTo, BelongsTo, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import CompanyCategory from './CompanyCategory'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public title: string

  @column()
  public image: string

  @column()
  public description: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => CompanyCategory, {
    foreignKey: 'categoryId',
  })
  public companyCategory: BelongsTo<typeof CompanyCategory>
}
