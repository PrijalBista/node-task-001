### Node js task implementation

##### Using AdonisJs Framework for nodejs
https://docs.adonisjs.com/
AdonisJs is a laravel like mvc framework for nodeJs which provides powerful tools for development of web applications.

### General Flow of implementation along with docs link for reference

###### Make models and migrations for CompanyCategory and Company
```bash
node ace make:model CompanyCategory -m
node ace make:model Company -m
```
> flag -m is for creating migration file

###### Create Schema
eg- for companies table
```javascript
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // table.integer('category_id').unsigned().references('company_categories.id')
      table.integer('category_id').unsigned().references('id').inTable('company_categories')
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
```
see `table builder` in docs to see all available methods for creating schema
https://docs.adonisjs.com/reference/database/table-builder

> Note , for column that are foreign id (category_id in above example), make sure to add unsigned()


###### Prepare Models with all columns and Relationships
eg- Company Model
```javascript
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
```
to learn more about `decorators` see this link
https://docs.adonisjs.com/reference/orm/decorators


###### Building Factories and Seeders.
Since , this is a trivial task factory for both models was made in a single database/factories.ts file
```javascript
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

```
More about factory here
https://docs.adonisjs.com/guides/models/factories

And only 1 seeder class was built with this command
```bash
node ace make:seed CompanyCategorySeeder
```
which simply uses CompanyCategoryFactory along with relation to create 10 Category, each category having 3 company records
```javascript
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CompanyCategoryFactory } from 'Database/factories'

export default class CompanyCategorySeederSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await CompanyCategoryFactory.with('companies', 3).createMany(10)
  }
}

```
More info on seeders
https://docs.adonisjs.com/guides/database/seeders

Testing models and relationships with `repl` which is similar to `tinker` in laravel.
```bash
node ace repl
```
In tinker console we have some helper modules to load Models which is loadModels(), after running this, all models will be loaded in the `repl` session and we can use Model with `model.CompanyCategory`.
eg- after opening repl console 
```bash
> loadModels()
recursively reading models from "app/Models"
> x = await models.Company.find(1)
> undefined
> x.serialize()
{
  id: 1,
  category_id: 1,
  title: 'asdf',
  image: 'asdf',
  description: 'asdf',
  status: 1,
  created_at: '2021-09-28T16:53:00.000+05:45',
  updated_at: null
}
>await x.load('companyCategory')
> x.serialize()
{
  id: 1,
  category_id: 1,
  title: 'asdf',
  image: 'asdf',
  description: 'asdf',
  status: 1,
  created_at: '2021-09-28T16:53:00.000+05:45',
  updated_at: null,
  companyCategory: {
    id: 1,
    title: 'category 1',
    created_at: '2021-09-28T16:51:52.000+05:45',
    updated_at: null
  }
}
```
There is more to this, for more info look into
https://docs.adonisjs.com/guides/repl


Now We move to actually making apis given in the task which inclues two CRUD apis
###### Route
Here we create separe `api.ts` for api related routes
```javascript
/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('category', 'Api/CompanyCategoryController')
  // Route.resource('company', 'CompanyController')
}).prefix('/api')

```

>Routing in adonisjs support almost everything that laravel provides, prefix, group, naming routes, namespace, etc. More info about routing here
https://docs.adonisjs.com/guides/routing

> To See all routes use this command
```bash
node ace list:routes
```

###### Controller
```bash
node ace make:controller -r true -e true Api/CompanyCategoryController
```
-r for resource controller
-e for exact name as given in the argument `Api/CompanyCategoryController`

More about controllers here
https://docs.adonisjs.com/guides/controllers

basic CRUD controller for CompanyCategory
```javascript
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompanyCategory from 'App/Models/CompanyCategory'

export default class CompanyCategoryController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const category = await CompanyCategory.query().preload('companies').paginate(page, 30)
    return category.toJSON()
  }

  public async store({ request }: HttpContextContract) {
    const category = new CompanyCategory()
    category.title = request.input('title')
    await category.save()
    return category
  }

  public async show({ params }: HttpContextContract) {
    const category = await CompanyCategory.query().where('id', params.id).preload('companies')
    return category
  }

  public async update({ response, request, params }: HttpContextContract) {
    const category = await CompanyCategory.findOrFail(params.id)
    category.title = request.input('title')
    if (await category.save()) {
      await category.load('companies')
      return category
    }
    return response.status(500)
  }

  public async destroy({ response, params }: HttpContextContract) {
    const category = await CompanyCategory.findOrFail(params.id)
    await category.delete()
    return response.status(204)
  }
}

```
Learn about responses here
https://docs.adonisjs.com/guides/response


###### Create CompanyController
```bash
node ace make:controller -r true -e true Api/CompanyController
```
Here we need to handle file upload, which can be done with the help of `Drive`
https://docs.adonisjs.com/guides/drive

The Controller code looks like this
```javascript
import Company from 'App/Models/Company'
import Drive from '@ioc:Adonis/Core/Drive'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CompanyController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const category = await Company.query().preload('companyCategory').paginate(page, 30)
    return category.toJSON()
  }

  public async store({ request }: HttpContextContract) {
    const company = new Company()
    company.title = request.input('title')
    company.description = request.input('description')
    company.status = request.input('status')
    company.categoryId = request.input('category_id')
    const image = request.file('image')
    if (image) {
      // handle image
      await image.moveToDisk('company')
      company.image = image.fileName || null
    }

    await company.save()
    await company.load('companyCategory')
    return company
  }

  public async show({ params }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    company.load('companyCategory')
    return company
  }

  public async update({ request, params, response }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    company.title = request.input('title')
    company.description = request.input('description')
    company.status = request.input('status')
    company.categoryId = request.input('category_id')
    const image = request.file('image')
    if (image) {
      // delete previos image if exists
      if (company.image) {
        await Drive.delete(`company/${company.image}`)
      }
      await image.moveToDisk('company')
      company.image = image.fileName || null
    }

    if (await company.save()) {
      await company.load('companyCategory')
      return company
    }
    return response.status(500)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    if (company.image) {
      await Drive.delete(`company/${company.image}`)
    }
    await company.delete()
    return response.status(204)
  }
}

```
> Note TODO request validation

Then on api response i added proper relative url by mutating image property in Company Model as such

```javascript
export default class Company extends BaseModel {
//...
  @column({
    serialize: (value: string | null) => {
      return value ? `uploads/company/${value}` : value
    },
  })
  public image: string | null
//...
}
```
