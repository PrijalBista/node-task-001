/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('category', 'Api/CompanyCategoryController').apiOnly()
  Route.resource('company', 'Api/CompanyController').apiOnly()
})
  .prefix('/api')
  .middleware('checkApiKey')
