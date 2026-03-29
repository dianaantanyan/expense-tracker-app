import { DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

const PREDEFINED_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Health',
  'Utilities',
  'Shopping',
  'Bills',
];

export async function seedPredefinedCategories(dataSource: DataSource) {
  const categoryRepo = dataSource.getRepository(Category);

  for (const name of PREDEFINED_CATEGORIES) {
    const exists = await categoryRepo.findOne({
      where: { name, user: undefined }, 
    });

    if (!exists) {
      const category = categoryRepo.create({ name }); 
      await categoryRepo.save(category);
    }
  }

  console.log('Predefined categories seeded.');
}