import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckApiKey {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const apiKey = request.header('api_key')
    if (!apiKey) {
      return response.unauthorized({ error: 'API_KEY is required in header' })
    }

    if (apiKey !== 'BA673A414C3B44C98478BB5CF10A0F832574090C') {
      return response.unauthorized({ error: 'Invalid API_KEY' })
    }

    await next()
  }
}
