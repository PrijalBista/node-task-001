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
