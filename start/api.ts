/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('category', 'Api/CompanyCategoryController')
  Route.resource('company', 'Api/CompanyController')
}).prefix('/api')
