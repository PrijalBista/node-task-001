import { DateTime } from 'luxon'
import Drive from '@ioc:Adonis/Core/Drive'
import CompanyCategory from './CompanyCategory'
import { belongsTo, BelongsTo, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public title: string

  @column({
    serialize: (value: string | null) => {
      return value ? `uploads/company/${value}` : value
    },
  })
  public image: string | null

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
