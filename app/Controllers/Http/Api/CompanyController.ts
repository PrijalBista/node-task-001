import Company from 'App/Models/Company'
import Drive from '@ioc:Adonis/Core/Drive'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateCompanyValidator from 'App/Validators/CreateCompanyValidator'
import UpdateCompanyValidator from 'App/Validators/UpdateCompanyValidator'
export default class CompanyController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const category = await Company.query().preload('companyCategory').paginate(page, 30)
    return category.toJSON()
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(CreateCompanyValidator)
    const company = new Company()
    let data = Object.assign({}, payload)
    delete data.image
    const image = payload.image
    if (image) {
      // handle image
      await image.moveToDisk('company')
      data.image = image.fileName || null
    }

    await company.fill(data).save()
    if (company.categoryId) {
      await company.load('companyCategory')
      return company
    }
    return company
  }

  public async show({ params }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    company.load('companyCategory')
    return company
  }

  public async update({ request, params, response }: HttpContextContract) {
    const payload = await request.validate(UpdateCompanyValidator)
    const company = await Company.findOrFail(params.id)
    let data = Object.assign({}, payload)
    delete data.image
    const image = payload.image
    if (image) {
      // delete previos image if exists
      if (company.image) {
        await Drive.delete(`company/${company.image}`)
      }
      await image.moveToDisk('company')
      data.image = image.fileName || null
    }
    // console.log(data)
    if (await company.merge(data).save()) {
      await company.load('companyCategory')
      return company
    }
    return response.status(500)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    if (company.image) {
      await Drive.delete(`company / ${company.image}`)
    }
    await company.delete()
    return response.status(204)
  }

  protected async preloadCompanyCategory(company) {
    if (company.categoryId) {
      await company.load('companyCategory')
      return company
    }
  }
}
