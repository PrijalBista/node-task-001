import Factory from '@ioc:Adonis/Lucid/Factory'
import CompanyCategory from 'App/Models/CompanyCategory'
import Company from 'App/Models/Company'


export const CompanyFactory = Factory.define(Company, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    image: 'test',
    description: faker.lorem.sentences(3),
    status: faker.datatype.boolean()
  }
}).build()

export const CompanyCategoryFactory = Factory.define(CompanyCategory, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
  }
})
  .relation('companies', () => CompanyFactory)
  .build()
