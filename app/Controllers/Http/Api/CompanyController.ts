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
      await image.moveToDisk('./company/')
      company.image = image.fileName || null
    }

    await company.save()
    await company.load('companyCategory')
    return company
  }

  public async show({ params }: HttpContextContract) {
    const company = await Company.query().where('id', params.id).preload('companyCategory')
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
        await Drive.delete(`./company/${company.image}`)
      }
      await image.moveToDisk('./company/')
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
      await Drive.delete(`./company/${company.image}`)
    }
    await company.delete()
    return response.status(204)
  }
}
