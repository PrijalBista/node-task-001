import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CompanyCategoryFactory } from 'Database/factories'

export default class CompanyCategorySeederSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await CompanyCategoryFactory.with('companies', 3).createMany(10)
  }
}
